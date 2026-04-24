const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  PermissionFlagsBits,
  PermissionsBitField
} = require('discord.js');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'verification.json');

const VERIFIED_ROLE_NAME = process.env.VERIFIED_ROLE_NAME || 'Verificado';
const UNVERIFIED_ROLE_NAME = process.env.UNVERIFIED_ROLE_NAME || 'Não Verificado';
const VERIFY_CHANNEL_NAME = process.env.VERIFY_CHANNEL_NAME || 'verificacao';
const LOG_CHANNEL_NAME = process.env.LOG_CHANNEL_NAME || 'verificacao-logs';

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

function makeCode() {
  return `RRALALS7-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function embed(title, description, color = 0x7c3aed) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'RRALALS7 sempre ajuda.' })
    .setTimestamp();
}

async function getRobloxUser(username) {
  const response = await axios.post('https://users.roblox.com/v1/usernames/users', {
    usernames: [username],
    excludeBannedUsers: false
  });
  return response.data && response.data.data ? response.data.data[0] : null;
}

async function getRobloxDescription(userId) {
  const response = await axios.get(`https://users.roblox.com/v1/users/${userId}`);
  return response.data && response.data.description ? response.data.description : '';
}

async function findOrCreateRole(guild, name, color) {
  let role = guild.roles.cache.find(r => r.name === name);
  if (!role) role = await guild.roles.create({ name, color, reason: 'RRALALS7 Rigid Verification setup' });
  return role;
}

async function findOrCreateChannel(guild, name, overwrites) {
  let channel = guild.channels.cache.find(c => c.name === name && c.type === ChannelType.GuildText);
  if (!channel) {
    channel = await guild.channels.create({
      name,
      type: ChannelType.GuildText,
      permissionOverwrites: overwrites,
      reason: 'RRALALS7 Rigid Verification setup'
    });
  }
  return channel;
}

async function log(guild, message) {
  const channel = guild.channels.cache.find(c => c.name === LOG_CHANNEL_NAME && c.type === ChannelType.GuildText);
  if (channel) await channel.send(message).catch(() => null);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('ready', () => console.log(`Roblox Rigid Verification online como ${client.user.tag}`));

client.on('guildMemberAdd', async member => {
  try {
    const unverified = member.guild.roles.cache.find(r => r.name === UNVERIFIED_ROLE_NAME);
    if (unverified) await member.roles.add(unverified).catch(() => null);
    await log(member.guild, `👤 Novo membro não verificado: ${member.user.tag}`);
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isButton() && interaction.customId === 'verify_start_button') {
      return interaction.reply({ content: 'Use `/verify start username:SeuUsuarioRoblox` para iniciar.', ephemeral: true });
    }

    if (!interaction.isChatInputCommand() || interaction.commandName !== 'verify') return;

    const sub = interaction.options.getSubcommand();
    const data = readData();
    data[interaction.guildId] ||= {};
    const guildData = data[interaction.guildId];

    if (sub === 'setup') {
      if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({ content: 'Apenas administradores podem configurar.', ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      const verified = await findOrCreateRole(interaction.guild, VERIFIED_ROLE_NAME, 0x22c55e);
      const unverified = await findOrCreateRole(interaction.guild, UNVERIFIED_ROLE_NAME, 0xef4444);

      const verifyOverwrites = [
        { id: interaction.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: unverified.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
        { id: verified.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels] }
      ];

      const logOverwrites = [
        { id: interaction.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ];

      const verifyChannel = await findOrCreateChannel(interaction.guild, VERIFY_CHANNEL_NAME, verifyOverwrites);
      await findOrCreateChannel(interaction.guild, LOG_CHANNEL_NAME, logOverwrites);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('verify_start_button').setLabel('Como verificar').setStyle(ButtonStyle.Primary).setEmoji('🧱')
      );

      await verifyChannel.send({
        embeds: [embed('🧱 Verificação Roblox', 'Para liberar o servidor, use `/verify start username:SeuUsuarioRoblox`, coloque o código na descrição pública do seu perfil Roblox e depois use `/verify check`.')],
        components: [row]
      });

      return interaction.editReply(`Setup concluído. Canal: ${verifyChannel}. Cargos: ${verified}, ${unverified}.`);
    }

    if (sub === 'start') {
      const username = interaction.options.getString('username');
      await interaction.deferReply({ ephemeral: true });

      const robloxUser = await getRobloxUser(username);
      if (!robloxUser) return interaction.editReply('Usuário Roblox não encontrado.');

      const code = makeCode();
      guildData[interaction.user.id] = {
        discordId: interaction.user.id,
        robloxId: robloxUser.id,
        username: robloxUser.name,
        displayName: robloxUser.displayName,
        code,
        verified: false,
        startedAt: Date.now()
      };
      writeData(data);

      await log(interaction.guild, `🧱 ${interaction.user.tag} iniciou verificação Roblox como ${robloxUser.name}.`);
      return interaction.editReply({ embeds: [embed('🧱 Verificação iniciada', `Coloque este código na descrição pública do seu perfil Roblox:\n\n\`${code}\`\n\nDepois use \`/verify check\`.`)] });
    }

    if (sub === 'check') {
      const userData = guildData[interaction.user.id];
      if (!userData) return interaction.reply({ content: 'Você ainda não iniciou a verificação. Use `/verify start`.', ephemeral: true });

      await interaction.deferReply({ ephemeral: true });
      const description = await getRobloxDescription(userData.robloxId);

      if (!description.includes(userData.code)) {
        await log(interaction.guild, `⚠️ ${interaction.user.tag} tentou verificar, mas o código não foi encontrado.`);
        return interaction.editReply('Código ainda não encontrado na descrição pública do Roblox.');
      }

      userData.verified = true;
      userData.verifiedAt = Date.now();
      writeData(data);

      const verified = interaction.guild.roles.cache.find(r => r.name === VERIFIED_ROLE_NAME);
      const unverified = interaction.guild.roles.cache.find(r => r.name === UNVERIFIED_ROLE_NAME);
      if (verified) await interaction.member.roles.add(verified).catch(() => null);
      if (unverified) await interaction.member.roles.remove(unverified).catch(() => null);

      await log(interaction.guild, `✅ ${interaction.user.tag} verificado como Roblox ${userData.username}.`);
      return interaction.editReply({ embeds: [embed('✅ Verificação concluída', `Você foi verificado como **${userData.username}**.`)] });
    }

    if (sub === 'status') {
      const userData = guildData[interaction.user.id];
      if (!userData) return interaction.reply({ content: 'Você ainda não iniciou verificação.', ephemeral: true });
      return interaction.reply({ embeds: [embed('📌 Status', `**Roblox:** ${userData.username}\n**ID:** ${userData.robloxId}\n**Verificado:** ${userData.verified ? 'sim' : 'não'}`)], ephemeral: true });
    }

    if (sub === 'reset') {
      if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.reply({ content: 'Você precisa de permissão para gerenciar servidor.', ephemeral: true });
      }

      const target = interaction.options.getUser('usuario');
      delete guildData[target.id];
      writeData(data);
      await log(interaction.guild, `♻️ Verificação resetada para ${target.tag} por ${interaction.user.tag}.`);
      return interaction.reply({ content: `Verificação de ${target} resetada.`, ephemeral: true });
    }
  } catch (error) {
    console.error(error);
    if (interaction.deferred) return interaction.editReply('Erro no sistema de verificação.');
    if (!interaction.replied) return interaction.reply({ content: 'Erro no sistema de verificação.', ephemeral: true }).catch(() => null);
  }
});

client.login(process.env.DISCORD_TOKEN);
