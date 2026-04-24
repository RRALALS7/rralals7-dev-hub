require('dotenv').config();

const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  Partials,
  PermissionsBitField,
  StringSelectMenuBuilder
} = require('discord.js');

const { readDb, writeDb, getGuild } = require('./db');
const { createEmbed, getDomain, lookupRobloxUser, checkSafeBrowsing } = require('./utils');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`✅ RRALALS7 Bot Suite online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isChatInputCommand()) return handleCommand(interaction);
    if (interaction.isButton()) return handleButton(interaction);
    if (interaction.isStringSelectMenu()) return handleSelect(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: '❌ Ocorreu um erro ao executar isso.', ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ content: '❌ Ocorreu um erro ao executar isso.', ephemeral: true }).catch(() => {});
    }
  }
});

async function handleCommand(interaction) {
  const data = readDb();
  const guildData = getGuild(data, interaction.guildId);

  if (interaction.commandName === 'ping') {
    return interaction.reply({ embeds: [createEmbed('🏓 Pong!', `Latência: ${client.ws.ping}ms`)] });
  }

  if (interaction.commandName === 'help') {
    return interaction.reply({ embeds: [createEmbed('🤖 RRALALS7 Bot Suite', [
      '`/ping` — testa o bot',
      '`/ticket setup` — cria painel de tickets',
      '`/ticket close` — fecha ticket atual',
      '`/roles setup` — cria painel de auto-cargos',
      '`/roblox user` — consulta perfil público Roblox',
      '`/checklink` — verifica um link',
      '`/poll` — cria enquete',
      '`/giveaway` — cria sorteio simples'
    ].join('\n'))] });
  }

  if (interaction.commandName === 'ticket') {
    const sub = interaction.options.getSubcommand();

    if (sub === 'setup') {
      if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: '❌ Apenas administradores podem configurar tickets.', ephemeral: true });
      }

      const logs = interaction.options.getChannel('logs');
      const staff = interaction.options.getRole('staff');

      guildData.ticketLogChannelId = logs?.id || guildData.ticketLogChannelId;
      guildData.staffRoleId = staff?.id || guildData.staffRoleId;
      writeDb(data);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_open')
          .setLabel('Abrir Ticket')
          .setEmoji('🎟️')
          .setStyle(ButtonStyle.Primary)
      );

      return interaction.reply({ embeds: [createEmbed('🎟️ Suporte', 'Clique no botão abaixo para abrir um ticket privado com a staff.')], components: [row] });
    }

    if (sub === 'close') {
      const ticket = data.tickets[interaction.channelId];
      if (!ticket) return interaction.reply({ content: '❌ Este canal não parece ser um ticket.', ephemeral: true });

      await interaction.reply('🔒 Fechando ticket em 5 segundos...');
      delete data.tickets[interaction.channelId];
      writeDb(data);
      setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    }
  }

  if (interaction.commandName === 'roles') {
    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '❌ Apenas administradores podem configurar auto-cargos.', ephemeral: true });
    }

    const roles = [];
    for (let i = 1; i <= 5; i++) {
      const role = interaction.options.getRole(`cargo${i}`);
      if (role) roles.push(role);
    }

    const menu = new StringSelectMenuBuilder()
      .setCustomId('roles_select')
      .setPlaceholder('Escolha seus cargos')
      .setMinValues(0)
      .setMaxValues(roles.length)
      .addOptions(roles.map(role => ({ label: role.name, value: role.id })));

    const row = new ActionRowBuilder().addComponents(menu);

    return interaction.reply({ embeds: [createEmbed('🔐 Auto-Cargos', 'Selecione abaixo os cargos que você quer receber ou remover.')], components: [row] });
  }

  if (interaction.commandName === 'roblox') {
    const username = interaction.options.getString('username');
    await interaction.deferReply();

    const user = await lookupRobloxUser(username);
    if (!user) return interaction.editReply('❌ Usuário Roblox não encontrado.');

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setTitle(`🧱 ${user.name}`)
      .setURL(user.profileUrl)
      .setDescription(`**Display:** ${user.displayName}\n**User ID:** ${user.id}\n**Perfil:** ${user.profileUrl}`)
      .setFooter({ text: 'Dados públicos. RRALALS7 sempre ajuda.' })
      .setTimestamp();

    if (user.thumbnail) embed.setThumbnail(user.thumbnail);
    return interaction.editReply({ embeds: [embed] });
  }

  if (interaction.commandName === 'checklink') {
    const url = interaction.options.getString('url');
    const domain = getDomain(url);
    if (!domain) return interaction.reply({ content: '❌ Link inválido.', ephemeral: true });

    await interaction.deferReply({ ephemeral: true });

    let verdict = 'unknown';
    let reason = 'Sem dados suficientes.';

    if (guildData.safeDomains.includes(domain)) {
      verdict = 'safe';
      reason = 'Domínio está na whitelist local.';
    } else if (guildData.blockedDomains.includes(domain)) {
      verdict = 'suspicious';
      reason = 'Domínio está na blacklist local.';
    } else {
      const checked = await checkSafeBrowsing(url, process.env.SAFE_BROWSING_API_KEY);
      verdict = checked.verdict;
      reason = checked.reason;
    }

    data.linkChecks.push({ guildId: interaction.guildId, userId: interaction.user.id, url, domain, verdict, checkedAt: new Date().toISOString() });
    writeDb(data);

    const emoji = verdict === 'safe' ? '✅' : verdict === 'malicious' ? '🚨' : verdict === 'suspicious' ? '⚠️' : '❔';
    return interaction.editReply({ embeds: [createEmbed(`${emoji} Resultado: ${verdict}`, `**Domínio:** ${domain}\n**Motivo:** ${reason}`)] });
  }

  if (interaction.commandName === 'poll') {
    const question = interaction.options.getString('pergunta');
    const options = [1, 2, 3, 4].map(i => interaction.options.getString(`opcao${i}`)).filter(Boolean);
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setTitle('🗳️ Enquete')
      .setDescription(`**${question}**\n\n${options.map((opt, i) => `${emojis[i]} ${opt}`).join('\n')}`)
      .setFooter({ text: `Criado por ${interaction.user.tag}` })
      .setTimestamp();

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    for (let i = 0; i < options.length; i++) await msg.react(emojis[i]);
    return;
  }

  if (interaction.commandName === 'giveaway') {
    const prize = interaction.options.getString('premio');
    const minutes = interaction.options.getInteger('minutos');
    const endsAt = Date.now() + minutes * 60_000;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('giveaway_join').setLabel('Participar').setEmoji('🎁').setStyle(ButtonStyle.Success)
    );

    const msg = await interaction.reply({ embeds: [createEmbed('🎁 Sorteio', `**Prêmio:** ${prize}\n**Termina:** <t:${Math.floor(endsAt / 1000)}:R>\n\nClique no botão para participar.`)], components: [row], fetchReply: true });

    data.giveaways[msg.id] = { prize, channelId: msg.channelId, guildId: interaction.guildId, participants: [], endsAt };
    writeDb(data);

    setTimeout(() => finishGiveaway(msg.id), minutes * 60_000);
  }
}

async function handleButton(interaction) {
  const data = readDb();
  const guildData = getGuild(data, interaction.guildId);

  if (interaction.customId === 'ticket_open') {
    const existing = Object.values(data.tickets).find(t => t.guildId === interaction.guildId && t.userId === interaction.user.id);
    if (existing) return interaction.reply({ content: '❌ Você já tem um ticket aberto.', ephemeral: true });

    const overwrites = [
      { id: interaction.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
      { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels] }
    ];

    if (guildData.staffRoleId) {
      overwrites.push({ id: guildData.staffRoleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] });
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      type: ChannelType.GuildText,
      permissionOverwrites: overwrites
    });

    data.tickets[channel.id] = { guildId: interaction.guildId, userId: interaction.user.id, createdAt: new Date().toISOString() };
    writeDb(data);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_close_button').setLabel('Fechar Ticket').setEmoji('🔒').setStyle(ButtonStyle.Danger)
    );

    await channel.send({ content: `<@${interaction.user.id}>`, embeds: [createEmbed('🎟️ Ticket criado', 'Explique seu problema com detalhes. A staff vai te ajudar assim que possível.')], components: [row] });
    return interaction.reply({ content: `✅ Ticket criado: ${channel}`, ephemeral: true });
  }

  if (interaction.customId === 'ticket_close_button') {
    const ticket = data.tickets[interaction.channelId];
    if (!ticket) return interaction.reply({ content: '❌ Este canal não é um ticket registrado.', ephemeral: true });
    await interaction.reply('🔒 Fechando ticket em 5 segundos...');
    delete data.tickets[interaction.channelId];
    writeDb(data);
    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
  }

  if (interaction.customId === 'giveaway_join') {
    const giveaway = data.giveaways[interaction.message.id];
    if (!giveaway) return interaction.reply({ content: '❌ Sorteio não encontrado.', ephemeral: true });
    if (!giveaway.participants.includes(interaction.user.id)) giveaway.participants.push(interaction.user.id);
    writeDb(data);
    return interaction.reply({ content: '✅ Você entrou no sorteio!', ephemeral: true });
  }
}

async function handleSelect(interaction) {
  if (interaction.customId !== 'roles_select') return;

  const selected = new Set(interaction.values);
  const all = interaction.component.options.map(o => o.value);

  for (const roleId of all) {
    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) continue;
    if (selected.has(roleId)) await interaction.member.roles.add(role).catch(() => {});
    else await interaction.member.roles.remove(role).catch(() => {});
  }

  return interaction.reply({ content: '✅ Seus cargos foram atualizados.', ephemeral: true });
}

async function finishGiveaway(messageId) {
  const data = readDb();
  const giveaway = data.giveaways[messageId];
  if (!giveaway) return;

  const channel = await client.channels.fetch(giveaway.channelId).catch(() => null);
  if (!channel) return;

  const winnerId = giveaway.participants[Math.floor(Math.random() * giveaway.participants.length)];
  if (!winnerId) {
    await channel.send(`🎁 Sorteio de **${giveaway.prize}** encerrado sem participantes.`);
  } else {
    await channel.send(`🎉 Parabéns <@${winnerId}>! Você ganhou **${giveaway.prize}**.`);
  }

  delete data.giveaways[messageId];
  writeDb(data);
}

client.login(process.env.DISCORD_TOKEN);
