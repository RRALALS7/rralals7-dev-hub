const dotenv = require('dotenv');
dotenv.config();

const { Client, EmbedBuilder, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

function embed(title, description) {
  return new EmbedBuilder()
    .setColor(0x7c3aed)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'RRALALS7 sempre ajuda.' })
    .setTimestamp();
}

client.once('ready', () => console.log(`Poll Bot online como ${client.user.tag}`));

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'poll') return;
    const question = interaction.options.getString('pergunta');
    const options = [1, 2, 3, 4, 5].map(i => interaction.options.getString(`opcao${i}`)).filter(Boolean);
    const description = `**${question}**\n\n${options.map((option, index) => `${emojis[index]} ${option}`).join('\n')}`;
    const message = await interaction.reply({ embeds: [embed('🗳️ Enquete', description)], fetchReply: true });
    for (let i = 0; i < options.length; i++) await message.react(emojis[i]);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) await interaction.reply({ content: 'Erro ao criar enquete.', ephemeral: true }).catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
