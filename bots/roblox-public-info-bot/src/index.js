const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const { Client, EmbedBuilder, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function embed(title, description, color = 0x7c3aed) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'Dados públicos. RRALALS7 sempre ajuda.' })
    .setTimestamp();
}

async function getUser(username) {
  const userResponse = await axios.post('https://users.roblox.com/v1/usernames/users', {
    usernames: [username],
    excludeBannedUsers: false
  });

  const user = userResponse.data && userResponse.data.data ? userResponse.data.data[0] : null;
  if (!user) return null;

  const thumbnailResponse = await axios.get('https://thumbnails.roblox.com/v1/users/avatar-headshot', {
    params: {
      userIds: user.id,
      size: '420x420',
      format: 'Png',
      isCircular: false
    }
  });

  const thumbnail = thumbnailResponse.data && thumbnailResponse.data.data && thumbnailResponse.data.data[0]
    ? thumbnailResponse.data.data[0].imageUrl
    : null;

  return {
    id: user.id,
    name: user.name,
    displayName: user.displayName,
    thumbnail,
    profileUrl: `https://www.roblox.com/users/${user.id}/profile`
  };
}

client.once('ready', () => console.log(`Roblox Public Info Bot online como ${client.user.tag}`));

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== 'roblox') return;
    if (interaction.options.getSubcommand() !== 'info') return;

    const username = interaction.options.getString('username');
    await interaction.deferReply();

    const user = await getUser(username);
    if (!user) return interaction.editReply('Usuário Roblox não encontrado.');

    const response = embed(
      `🧱 ${user.name}`,
      `**Display name:** ${user.displayName}\n**User ID:** ${user.id}\n**Perfil:** ${user.profileUrl}`
    ).setURL(user.profileUrl);

    if (user.thumbnail) response.setThumbnail(user.thumbnail);
    return interaction.editReply({ embeds: [response] });
  } catch (error) {
    console.error(error);
    if (interaction.deferred) return interaction.editReply('Erro ao consultar dados públicos do Roblox.');
    return interaction.reply({ content: 'Erro ao consultar dados públicos do Roblox.', ephemeral: true }).catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
