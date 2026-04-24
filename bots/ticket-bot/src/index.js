const dotenv = require('dotenv');
dotenv.config();

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  PermissionsBitField
} = require('discord.js');

const openTickets = new Map();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

function embed(title, description) {
  return new EmbedBuilder()
    .setColor(0x7c3aed)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'RRALALS7 sempre ajuda.' })
    .setTimestamp();
}

client.once('ready', () => {
  console.log(`Ticket Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName !== 'ticket') return;

      const sub = interaction.options.getSubcommand();

      if (sub === 'setup') {
        if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
          return interaction.reply({ content: 'Apenas administradores podem criar o painel.', ephemeral: true });
        }

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('open_ticket')
            .setLabel('Abrir Ticket')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🎟️')
        );

        return interaction.reply({
          embeds: [embed('🎟️ Suporte', 'Clique no botão abaixo para abrir um ticket privado.')],
          components: [row]
        });
      }

      if (sub === 'close') {
        if (!interaction.channel.name.startsWith('ticket-')) {
          return interaction.reply({ content: 'Este canal não parece ser um ticket.', ephemeral: true });
        }

        await interaction.reply('Fechando ticket em 5 segundos...');
        setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId === 'open_ticket') {
        const key = `${interaction.guildId}:${interaction.user.id}`;
        if (openTickets.has(key)) {
          return interaction.reply({ content: 'Você já possui um ticket aberto.', ephemeral: true });
        }

        const overwrites = [
          { id: interaction.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels] }
        ];

        if (process.env.STAFF_ROLE_ID) {
          overwrites.push({ id: process.env.STAFF_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] });
        }

        const channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, ''),
          type: ChannelType.GuildText,
          permissionOverwrites: overwrites
        });

        openTickets.set(key, channel.id);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Fechar Ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒')
        );

        await channel.send({
          content: `<@${interaction.user.id}>`,
          embeds: [embed('Ticket criado', 'Explique seu problema com detalhes. A staff vai ajudar assim que possível.')],
          components: [row]
        });

        return interaction.reply({ content: `Ticket criado: ${channel}`, ephemeral: true });
      }

      if (interaction.customId === 'close_ticket') {
        await interaction.reply('Fechando ticket em 5 segundos...');
        setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
      }
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
