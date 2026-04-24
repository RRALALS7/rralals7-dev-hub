const axios = require('axios');
const { logToChannel } = require('../core/logger');

function localSignals(text) {
  const lower = text.toLowerCase();
  const suspicious = ['scam', 'phishing', 'token', 'raid', 'flood', 'grabber', 'cookie', 'hack'];
  const hits = suspicious.filter(word => lower.includes(word));
  const short = text.length < 12;
  return { hits, short };
}

function contextPenalty(message, signals) {
  let penalty = 0;
  if (signals.short) penalty += 20;
  if (/x1|partida|boss|pvp|jogo|game/i.test(message.content)) penalty += 15;
  if (/exemplo|denuncia|suspeito|isso parece/i.test(message.content)) penalty += 25;
  return penalty;
}

async function groqAnalyze(text, context) {
  if (!process.env.GROQ_API_KEY) return null;

  const prompt = `Analise esta mensagem para moderação de Discord. Responda SOMENTE JSON com score 0-100, confidence 0-100, category e reason curto. Considere contexto gamer e evite falso positivo. Mensagem: ${JSON.stringify(text)} Contexto: ${JSON.stringify(context)}`;

  const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
    model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: 'Você é um classificador de moderação cauteloso. Nunca recomende ação forte sem alta confiança.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1
  }, { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } });

  const raw = response.data.choices?.[0]?.message?.content || '{}';
  const match = raw.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : raw);
}

function fallbackAnalyze(text, signals) {
  let score = signals.hits.length * 18;
  if (text.length > 180 && signals.hits.length) score += 15;
  score = Math.min(100, score);

  return {
    score,
    confidence: signals.hits.length ? 55 : 80,
    category: signals.hits.length ? 'suspicious_keyword' : 'safe',
    reason: signals.hits.length ? `Palavras sensíveis: ${signals.hits.join(', ')}` : 'Nada relevante detectado.'
  };
}

function finalDecision(result, penalty, historyCount, mode) {
  const rawScore = Number(result.score || 0);
  const confidence = Math.max(0, Math.min(100, Number(result.confidence || 0)));
  const score = Math.max(0, Math.min(100, rawScore - penalty + Math.min(20, historyCount * 5)));

  let action = 'none';
  if (score >= 21) action = 'log';
  if (score >= 45 && confidence >= 70) action = 'warn';
  if (mode === 'balanced' && score >= 75 && confidence >= 85) action = 'timeout';
  if (mode === 'strict' && score >= 90 && confidence >= 92) action = 'review';
  if (mode === 'manual') action = score >= 21 ? 'log' : 'none';

  return { score, confidence, action };
}

async function handleMessageGuard(message, guildData, save) {
  const userHistory = guildData.history[message.author.id] || [];
  const context = userHistory.slice(-5).map(item => item.content);
  const signals = localSignals(message.content);

  if (!signals.hits.length && message.content.length < 25) return;

  const ai = await groqAnalyze(message.content, context).catch(() => null);
  const analysis = ai || fallbackAnalyze(message.content, signals);
  const penalty = contextPenalty(message, signals);
  const repeated = userHistory.filter(item => Date.now() - item.at < 10 * 60 * 1000).length;
  const decision = finalDecision(analysis, penalty, repeated, guildData.config.mode);

  userHistory.push({ content: message.content.slice(0, 300), at: Date.now(), score: decision.score });
  guildData.history[message.author.id] = userHistory.slice(-10);
  guildData.events.push({ userId: message.author.id, channelId: message.channel.id, score: decision.score, confidence: decision.confidence, action: decision.action, at: Date.now() });
  guildData.events = guildData.events.slice(-300);
  save();

  if (decision.action === 'none') return;

  await logToChannel(message.guild, '🛡️ AI Message Guard', [
    `**Usuário:** ${message.author.tag}`,
    `**Canal:** ${message.channel}`,
    `**Score:** ${decision.score}`,
    `**Confiança:** ${decision.confidence}`,
    `**Ação:** ${decision.action}`,
    `**Categoria:** ${analysis.category || 'unknown'}`,
    `**Motivo:** ${analysis.reason || 'Sem motivo.'}`,
    `**Mensagem:** ${message.content.slice(0, 500)}`
  ].join('\n'));

  if (decision.action === 'warn') {
    await message.reply({ content: '⚠️ Essa mensagem parece quebrar as regras. Evite continuar nesse assunto.\n-# Sistema de moderação • RRALALS7' }).catch(() => null);
  }

  if (decision.action === 'timeout' && message.member?.moderatable) {
    await message.member.timeout(5 * 60 * 1000, 'AI Guard: score alto com confiança alta').catch(() => null);
    await message.reply({ content: '⚠️ Timeout curto aplicado por comportamento suspeito repetido.\n-# Sistema de moderação • RRALALS7' }).catch(() => null);
  }
}

async function analyzeText(text, mode) {
  const signals = localSignals(text);
  const ai = await groqAnalyze(text, []).catch(() => null);
  const analysis = ai || fallbackAnalyze(text, signals);
  const decision = finalDecision(analysis, 0, 0, mode);
  return { analysis, decision };
}

module.exports = { handleMessageGuard, analyzeText };
