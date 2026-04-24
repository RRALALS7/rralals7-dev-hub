const { PermissionFlagsBits } = require('discord.js');
const { embed } = require('../core/ui');

function repProfile(guildData, userId) {
  guildData.reputation[userId] ||= { score: 0, received: [], cooldowns: {} };
  return guildData.reputation[userId];
}

async function handleReputationCommand(interaction, guildData, save) {
  const sub = interaction.options.getSubcommand();

  if (sub === 'rep_give') {
    const target = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('motivo') || 'Sem motivo.';

    if (target.bot || target.id === interaction.user.id) {
      return interaction.reply({ content: 'Escolha outro membro válido.', ephemeral: true });
    }

    const giverProfile = repProfile(guildData, interaction.user.id);
    const now = Date.now();
    const last = giverProfile.cooldowns[target.id] || 0;
    const cooldown = 12 * 60 * 60 * 1000;

    if (now - last < cooldown) {
      return interaction.reply({ content: 'Você já deu reputação para esse membro recentemente.', ephemeral: true });
    }

    const targetProfile = repProfile(guildData, target.id);
    targetProfile.score += 1;
    targetProfile.received.push({ from: interaction.user.id, reason: reason.slice(0, 200), at: now });
    targetProfile.received = targetProfile.received.slice(-30);
    giverProfile.cooldowns[target.id] = now;
    save();

    return interaction.reply({ embeds: [embed('⭐ Reputação enviada', `${interaction.user} deu +1 reputação para ${target}.\nMotivo: ${reason.slice(0, 200)}`)] });
  }

  if (sub === 'rep_profile') {
    const target = interaction.options.getUser('usuario') || interaction.user;
    const profile = repProfile(guildData, target.id);
    return interaction.reply({ embeds: [embed('⭐ Perfil de reputação', `**Usuário:** ${target}\n**Score:** ${profile.score}\n**Registros:** ${profile.received.length}`)], ephemeral: !guildData.config.reputationPublic });
  }

  if (sub === 'rep_leaderboard') {
    const ranking = Object.entries(guildData.reputation)
      .sort((a, b) => Number(b[1].score || 0) - Number(a[1].score || 0))
      .slice(0, 10);

    const text = ranking.length
      ? ranking.map(([id, data], index) => `${index + 1}. <@${id}> — ${data.score} pontos`).join('\n')
      : 'Sem reputação registrada ainda.';

    return interaction.reply({ embeds: [embed('🏆 Ranking de reputação', text)] });
  }

  if (sub === 'rep_reset') {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({ content: 'Sem permissão para resetar reputação.', ephemeral: true });
    }

    const target = interaction.options.getUser('usuario');
    guildData.reputation[target.id] = { score: 0, received: [], cooldowns: {} };
    save();
    return interaction.reply({ content: `Reputação de ${target} resetada.`, ephemeral: true });
  }
}

module.exports = { handleReputationCommand, repProfile };
