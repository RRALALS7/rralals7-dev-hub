const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Client, EmbedBuilder, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'aiguard.json');
const LOG_CHANNEL_NAME = process.env.LOG_CHANNEL_NAME || 'mod-logs';

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '{}');
}
function readData() { ensureData(); try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return {}; } }
function writeData(data) { ensureData(); fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }
function guildConfig(data, guildId) {
  data[guildId] ||= { mode: process.env.MODERATION_MODE || 'safe', history: {}, events: [] };
  return data[guildId];
}
function embed(title, description, color = 0x7c3aed) {
  return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setFooter({ text: 'Sistema de moderação • RRALALS7' }).setTimestamp();
}
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
      { role: 'system', content: 'Você é um classificador de moderação cauteloso. Nunca recomende punição forte sem alta confiança.' },
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
  let score = Math.max(0, Math.min(100, Number(result.score || 0) - penalty + Math.min(20, historyCount * 5)));
  const confidence = Math.max(0, Math.min(100, Number(result.confidence || 0)));
  let action = 'none';
  if (score >= 21) action = 'log';
  if (score >= 45 && confidence >= 70) action = 'warn';
  if (mode === 'balanced' && score >= 75 && confidence >= 85) action = 'timeout';
  if (mode === 'strict' && score >= 90 && confidence >= 92) action = 'review';
  if (mode === 'manual') action = score >= 21 ? 'log' : 'none';
  return { score, confidence, action };
}
async function logToChannel(guild, payload) {
  const channel = guild.channels.cache.find(c => c.name === LOG_CHANNEL_NAME);
  if (!channel) return;
  await channel.send({ embeds: [embed('🛡️ AI Guard Log', payload)] }).catch(() => null);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.once('ready', () => console.log(`AI Moderation Guard online como ${client.user.tag}`));

client.on('messageCreate', async message => {
  try {
    if (!message.guild || message.author.bot) return;
    const data = readData();
    const config = guildConfig(data, message.guild.id);
    const userHistory = config.history[message.author.id] || [];
    const context = userHistory.slice(-5).map(item => item.content);
    const signals = localSignals(message.content);
    if (!signals.hits.length && message.content.length < 25) return;

    const ai = await groqAnalyze(message.content, context).catch(() => null);
    const analysis = ai || fallbackAnalyze(message.content, signals);
    const penalty = contextPenalty(message, signals);
    const repeated = userHistory.filter(item => Date.now() - item.at < 10 * 60 * 1000).length;
    const decision = finalDecision(analysis, penalty, repeated, config.mode);

    userHistory.push({ content: message.content.slice(0, 300), at: Date.now(), score: decision.score });
    config.history[message.author.id] = userHistory.slice(-10);
    config.events.push({ userId: message.author.id, channelId: message.channel.id, score: decision.score, confidence: decision.confidence, action: decision.action, at: Date.now() });
    config.events = config.events.slice(-200);
    writeData(data);

    if (decision.action === 'none') return;

    await logToChannel(message.guild, [
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
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'aiguard') return;
    const data = readData();
    const config = guildConfig(data, interaction.guildId);
    const sub = interaction.options.getSubcommand();

    if (sub === 'status') return interaction.reply({ embeds: [embed('🛡️ AI Guard Status', `Modo: **${config.mode}**\nEventos salvos: **${config.events.length}**`)], ephemeral: true });

    if (sub === 'mode') {
      if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({ content: 'Sem permissão.', ephemeral: true });
      config.mode = interaction.options.getString('modo');
      writeData(data);
      return interaction.reply({ content: `Modo alterado para **${config.mode}**.`, ephemeral: true });
    }

    if (sub === 'analyze') {
      if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ content: 'Sem permissão.', ephemeral: true });
      const text = interaction.options.getString('texto');
      const signals = localSignals(text);
      const ai = await groqAnalyze(text, []).catch(() => null);
      const analysis = ai || fallbackAnalyze(text, signals);
      const decision = finalDecision(analysis, 0, 0, config.mode);
      return interaction.reply({ embeds: [embed('🔎 Análise manual', `Score: **${decision.score}**\nConfiança: **${decision.confidence}**\nAção: **${decision.action}**\nMotivo: ${analysis.reason || 'Sem motivo.'}`)], ephemeral: true });
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) await interaction.reply({ content: 'Erro no AI Guard.', ephemeral: true }).catch(() => null);
  }
});

client.login(process.env.DISCORD_TOKEN);
