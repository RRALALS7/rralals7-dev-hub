const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { Client, EmbedBuilder, GatewayIntentBits } = require('discord.js');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'verifications.json');

function ensureData() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '{}');
}
function readData() { ensureData(); try { return JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch { return {}; } }
function writeData(data) { ensureData(); fs.writeFileSync(dataFile, JSON.stringify(data, null, 2)); }
function code() { return `RRALALS7-${Math.random().toString(36).slice(2, 8).toUpperCase()}`; }
function embed(title, description, color = 0x7c3aed) { return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setFooter({ text: 'RRALALS7 sempre ajuda.' }).setTimestamp(); }

async function getRobloxUser(username) {
  const response = await axios.post('https://users.roblox.com/v1/usernames/users', { usernames: [username], excludeBannedUsers: false });
  return response.data && response.data.data ? response.data.data[0] : null;
}
async function getRobloxDescription(userId) {
  const response = await axios.get(`https://users.roblox.com/v1/users/${userId}`);
  return response.data && response.data.description ? response.data.description : '';
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.once('ready', () => console.log(`Roblox Verify Bot online como ${client.user.tag}`));

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'verify') return;
    const sub = interaction.options.getSubcommand();
    const data = readData();
    data[interaction.guildId] ||= {};
    const guildData = data[interaction.guildId];
    const userData = guildData[interaction.user.id];

    if (sub === 'start') {
      const username = interaction.options.getString('username');
      await interaction.deferReply({ ephemeral: true });
      const robloxUser = await getRobloxUser(username);
      if (!robloxUser) return interaction.editReply('Usuario Roblox nao encontrado.');
      const generated = code();
      guildData[interaction.user.id] = { username: robloxUser.name, robloxId: robloxUser.id, code: generated, verified: false, startedAt: Date.now() };
      writeData(data);
      return interaction.editReply({ embeds: [embed('🧱 Verificacao iniciada', `Coloque este codigo na descricao publica do seu perfil Roblox:\n\n\`${generated}\`\n\nDepois use \`/verify check\`.`)] });
    }

    if (sub === 'status') {
      if (!userData) return interaction.reply({ content: 'Voce ainda nao iniciou verificacao. Use `/verify start`.', ephemeral: true });
      return interaction.reply({ embeds: [embed('📌 Status', `**Roblox:** ${userData.username}\n**ID:** ${userData.robloxId}\n**Verificado:** ${userData.verified ? 'sim' : 'nao'}`)], ephemeral: true });
    }

    if (sub === 'check') {
      if (!userData) return interaction.reply({ content: 'Voce ainda nao iniciou verificacao. Use `/verify start`.', ephemeral: true });
      await interaction.deferReply({ ephemeral: true });
      const description = await getRobloxDescription(userData.robloxId);
      if (!description.includes(userData.code)) return interaction.editReply('Codigo ainda nao encontrado na descricao publica do perfil.');
      userData.verified = true;
      userData.verifiedAt = Date.now();
      writeData(data);
      if (process.env.VERIFIED_ROLE_ID) await interaction.member.roles.add(process.env.VERIFIED_ROLE_ID).catch(() => null);
      return interaction.editReply({ embeds: [embed('✅ Verificado', `Conta Roblox **${userData.username}** verificada com sucesso.`)] });
    }
  } catch (error) {
    console.error(error);
    if (interaction.deferred) await interaction.editReply('Erro na verificacao.');
    else await interaction.reply({ content: 'Erro na verificacao.', ephemeral: true }).catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
