const { PermissionFlagsBits } = require('discord.js');
const { embed } = require('../core/ui');

function summarizeUser(guildData, userId) {
  const history = guildData.history[userId] || [];
  const events = guildData.events.filter(event => event.userId === userId).slice(-10);

  const avgScore = events.length
    ? Math.round(events.reduce((sum, event) => sum + Number(event.score || 0), 0) / events.length)
    : 0;

  const lastAction = events.length ? events[events.length - 1].action : 'none';

  return {
    historyCount: history.length,
    eventsCount: events.length,
    avgScore,
    lastAction
  };
}

async function handleStaffCommand(interaction, guildData) {
  if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.reply({ content: 'Sem permissão para usar Staff Assistant.', ephemeral: true });
  }

  const target = interaction.options.getUser('usuario');
  const summary = summarizeUser(guildData, target.id);

  const suggestion = summary.avgScore >= 70
    ? 'Revisar com atenção. Há sinais recentes fortes.'
    : summary.avgScore >= 40
      ? 'Acompanhar e revisar contexto antes de agir.'
      : 'Sem sinais fortes recentes.';

  return interaction.reply({
    embeds: [embed('🧠 Staff Assistant', [
      `**Usuário:** ${target}`,
      `**Eventos recentes:** ${summary.eventsCount}`,
      `**Histórico salvo:** ${summary.historyCount}`,
      `**Score médio:** ${summary.avgScore}`,
      `**Última ação:** ${summary.lastAction}`,
      `**Sugestão:** ${suggestion}`,
      '',
      'A decisão final deve ser da staff.'
    ].join('\n'))],
    ephemeral: true
  });
}

module.exports = { handleStaffCommand, summarizeUser };
