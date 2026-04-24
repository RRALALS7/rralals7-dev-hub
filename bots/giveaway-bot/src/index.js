const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  PermissionsBitField
} = require('discord.js');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'giveaways.json');

function ensureData() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '{}');
}

function readData() {
  ensureData();
  try { return JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch { return {}; }
}

function writeData(data) {
  ensureData();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function embed(title, description, color = 0x7c3aed) {
  return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setFooter({ text: 'RRALALS7 sempre ajuda.' }).setTimestamp();
}

function pickWinners(participants, count) {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Giveaway Bot online como ${client.user.tag}`);
  const data = readData();
  for (const [messageId, giveaway] of Object.entries(data)) {
    const delay = Math.max(1000, giveaway.endsAt - Date.now());
    setTimeout(() => finishGiveaway(messageId), delay);
  }
});

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isButton() && interaction.customId === 'giveaway_join') {
      const data = readData();
      const giveaway = data[interaction.message.id];
      if (!giveaway) return interaction.reply({ content: 'Sorteio não encontrado.', ephemeral: true });
      if (Date.now() > giveaway.endsAt) return interaction.reply({ content: 'Este sorteio já acabou.', ephemeral: true });
      if (!giveaway.participants.includes(interaction.user.id)) giveaway.participants.push(interaction.user.id);
      writeData(data);
      return interaction.reply({ content: 'Você entrou no sorteio! 🎁', ephemeral: true });
    }

    if (!interaction.isChatInputCommand() || interaction.commandName !== 'giveaway') return;
    const sub = interaction.options.getSubcommand();
    const data = readData();

    if (sub === 'create') {
      if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return interaction.reply({ content: 'Você precisa da permissão Gerenciar Servidor.', ephemeral: true });
      }

      const prize = interaction.options.getString('premio');
      const minutes = interaction.options.getInteger('minutos');
      const winners = interaction.options.getInteger('ganhadores') || 1;
      const endsAt = Date.now() + minutes * 60_000;

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('giveaway_join').setLabel('Participar').setEmoji('🎁').setStyle(ButtonStyle.Success)
      );

      const message = await interaction.reply({
        embeds: [embed('🎁 Sorteio', `**Prêmio:** ${prize}\n**Ganhadores:** ${winners}\n**Termina:** <t:${Math.floor(endsAt / 1000)}:R>\n\nClique no botão para participar.`)],
        components: [row],
        fetchReply: true
      });

      data[message.id] = { guildId: interaction.guildId, channelId: interaction.channelId, prize, winners, participants: [], endsAt, ended: false };
      writeData(data);
      setTimeout(() => finishGiveaway(message.id), minutes * 60_000);
      return;
    }

    if (sub === 'list') {
      const active = Object.entries(data).filter(([, g]) => g.guildId === interaction.guildId && !g.ended);
      if (!active.length) return interaction.reply({ content: 'Nenhum sorteio ativo.', ephemeral: true });
      return interaction.reply({ embeds: [embed('🎁 Sorteios ativos', active.map(([id, g]) => `**${g.prize}** — ID: \`${id}\` — <t:${Math.floor(g.endsAt / 1000)}:R>`).join('\n'))], ephemeral: true });
    }

    if (sub === 'reroll') {
      if (!interaction.memberPermissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return interaction.reply({ content: 'Você precisa da permissão Gerenciar Servidor.', ephemeral: true });
      }
      const messageId = interaction.options.getString('message_id');
      const giveaway = data[messageId];
      if (!giveaway) return interaction.reply({ content: 'Sorteio não encontrado.', ephemeral: true });
      const winners = pickWinners(giveaway.participants, giveaway.winners);
      if (!winners.length) return interaction.reply({ content: 'Sem participantes para sortear.', ephemeral: true });
      return interaction.reply(`🎉 Novo resultado de **${giveaway.prize}**: ${winners.map(id => `<@${id}>`).join(', ')}`);
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) await interaction.reply({ content: 'Ocorreu um erro no sorteio.', ephemeral: true }).catch(() => {});
  }
});

async function finishGiveaway(messageId) {
  const data = readData();
  const giveaway = data[messageId];
  if (!giveaway || giveaway.ended) return;
  giveaway.ended = true;
  writeData(data);

  const channel = await client.channels.fetch(giveaway.channelId).catch(() => null);
  if (!channel) return;

  const winners = pickWinners(giveaway.participants, giveaway.winners);
  if (!winners.length) return channel.send(`🎁 Sorteio de **${giveaway.prize}** encerrado sem participantes.`);
  return channel.send(`🎉 Sorteio encerrado! Prêmio: **${giveaway.prize}**\nGanhador(es): ${winners.map(id => `<@${id}>`).join(', ')}`);
}

client.login(process.env.DISCORD_TOKEN);
