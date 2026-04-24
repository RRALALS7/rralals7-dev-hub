const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const { Client, EmbedBuilder, GatewayIntentBits } = require('discord.js');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'flashcards.json');

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '{}');
}

function readData() {
  ensureData();
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return {}; }
}

function writeData(data) {
  ensureData();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function embed(title, description, color = 0x7c3aed) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'RRALALS7 sempre ajuda.' })
    .setTimestamp();
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Study Helper Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'study') return;

    const data = readData();
    data[interaction.user.id] ||= [];
    const cards = data[interaction.user.id];
    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {
      const question = interaction.options.getString('pergunta').slice(0, 400);
      const answer = interaction.options.getString('resposta').slice(0, 700);
      const id = Date.now().toString(36);
      cards.push({ id, question, answer, createdAt: Date.now() });
      writeData(data);
      return interaction.reply({ embeds: [embed('✅ Flashcard salvo', `**ID:** \`${id}\`\n**Pergunta:** ${question}`)], ephemeral: true });
    }

    if (sub === 'list') {
      if (!cards.length) return interaction.reply({ content: 'Você ainda não tem flashcards.', ephemeral: true });
      const text = cards.slice(-10).map(card => `\`${card.id}\` — ${card.question}`).join('\n');
      return interaction.reply({ embeds: [embed('📚 Seus flashcards', text)], ephemeral: true });
    }

    if (sub === 'quiz') {
      if (!cards.length) return interaction.reply({ content: 'Você ainda não tem flashcards.', ephemeral: true });
      const card = cards[Math.floor(Math.random() * cards.length)];
      return interaction.reply({ embeds: [embed('🧠 Quiz', `**Pergunta:** ${card.question}\n\n||Resposta: ${card.answer}||`)], ephemeral: true });
    }

    if (sub === 'remove') {
      const id = interaction.options.getString('id');
      const index = cards.findIndex(card => card.id === id);
      if (index === -1) return interaction.reply({ content: 'Flashcard não encontrado.', ephemeral: true });
      cards.splice(index, 1);
      writeData(data);
      return interaction.reply({ content: 'Flashcard removido.', ephemeral: true });
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) return interaction.reply({ content: 'Erro no Study Helper Bot.', ephemeral: true }).catch(() => null);
  }
});

client.login(process.env.DISCORD_TOKEN);
