const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const { Client, EmbedBuilder, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'faq.json');

function ensureData() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '{}');
}
function readData() { ensureData(); try { return JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch { return {}; } }
function writeData(data) { ensureData(); fs.writeFileSync(dataFile, JSON.stringify(data, null, 2)); }
function embed(title, description, color = 0x7c3aed) { return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setFooter({ text: 'RRALALS7 sempre ajuda.' }).setTimestamp(); }
function blocked(text) {
  const bad = ['token grabber', 'phishing', 'raid', 'spam bot', 'roubar conta', 'cookie roblox', 'bypass ban'];
  return bad.some(word => text.toLowerCase().includes(word));
}
function bestFaq(faq, question) {
  const q = question.toLowerCase();
  const entries = Object.entries(faq);
  return entries.find(([key]) => q.includes(key.toLowerCase()));
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once('ready', () => console.log(`AI Moderator Bot online como ${client.user.tag}`));

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const data = readData();
    data[interaction.guildId] ||= {};
    const faq = data[interaction.guildId];

    if (interaction.commandName === 'ask') {
      const question = interaction.options.getString('pergunta');
      if (blocked(question)) return interaction.reply({ embeds: [embed('🛡️ Pedido bloqueado', 'Nao posso ajudar com abuso, golpe, spam, roubo de conta ou bypass.', 0xef4444)], ephemeral: true });
      const found = bestFaq(faq, question);
      if (found) return interaction.reply({ embeds: [embed(`🧠 FAQ: ${found[0]}`, found[1])] });
      return interaction.reply({ embeds: [embed('🧠 Assistente seguro', 'Ainda nao tenho uma FAQ para isso. Peça para a staff adicionar com `/faq add`.')] });
    }

    if (interaction.commandName === 'faq') {
      const sub = interaction.options.getSubcommand();
      if (sub === 'list') {
        const keys = Object.keys(faq);
        return interaction.reply({ embeds: [embed('📚 FAQs', keys.length ? keys.map(key => `- ${key}`).join('\n') : 'Nenhuma FAQ cadastrada.')] });
      }
      if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ content: 'Apenas staff pode gerenciar FAQ.', ephemeral: true });
      if (sub === 'add') {
        const key = interaction.options.getString('chave').slice(0, 50);
        const answer = interaction.options.getString('resposta').slice(0, 1500);
        if (blocked(key) || blocked(answer)) return interaction.reply({ content: 'Conteudo bloqueado por seguranca.', ephemeral: true });
        faq[key] = answer;
        writeData(data);
        return interaction.reply({ embeds: [embed('✅ FAQ adicionada', `Chave: **${key}**`)], ephemeral: true });
      }
      if (sub === 'remove') {
        const key = interaction.options.getString('chave');
        delete faq[key];
        writeData(data);
        return interaction.reply({ embeds: [embed('🗑️ FAQ removida', `Chave: **${key}**`)], ephemeral: true });
      }
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) await interaction.reply({ content: 'Erro no AI Moderator Bot.', ephemeral: true }).catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
