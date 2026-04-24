const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { logToChannel } = require('../core/logger');

async function setPanicMode(guild, guildData, enabled) {
  guildData.config.panic = enabled;

  const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);
  for (const channel of channels.values()) {
    if (channel.name.includes('log')) continue;
    await channel.permissionOverwrites.edit(guild.roles.everyone, {
      SendMessages: enabled ? false : null
    }).catch(() => null);
  }

  await logToChannel(guild, enabled ? '🚨 Modo pânico ativado' : '✅ Modo pânico desativado', enabled
    ? 'Canais de texto foram travados temporariamente.'
    : 'Canais de texto foram destravados.');
}

async function handleGuardianCommand(interaction, guildData, save) {
  const sub = interaction.options.getSubcommandGroup(false) || interaction.options.getSubcommand();

  if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.reply({ content: 'Sem permissão para usar Guardian.', ephemeral: true });
  }

  if (sub === 'guardian_status') {
    return interaction.reply({ content: `Modo pânico: **${guildData.config.panic ? 'ativado' : 'desativado'}**`, ephemeral: true });
  }

  if (sub === 'panic_on') {
    await setPanicMode(interaction.guild, guildData, true);
    save();
    return interaction.reply({ content: '🚨 Modo pânico ativado.', ephemeral: true });
  }

  if (sub === 'panic_off') {
    await setPanicMode(interaction.guild, guildData, false);
    save();
    return interaction.reply({ content: '✅ Modo pânico desativado.', ephemeral: true });
  }
}

module.exports = { handleGuardianCommand, setPanicMode };
