const { PermissionFlagsBits } = require('discord.js');
const { embed } = require('../core/ui');
const { logToChannel } = require('../core/logger');

function createAppeal(guildData, userId, reason) {
  const id = `appeal-${Date.now().toString(36)}`;
  guildData.appeals[id] = {
    id,
    userId,
    reason,
    status: 'pending',
    createdAt: Date.now(),
    reviewedBy: null,
    response: null
  };
  return guildData.appeals[id];
}

async function handleAppealCommand(interaction, guildData, save) {
  const sub = interaction.options.getSubcommand();

  if (sub === 'appeal_open') {
    const reason = interaction.options.getString('motivo');
    const appeal = createAppeal(guildData, interaction.user.id, reason.slice(0, 700));
    save();
    await logToChannel(interaction.guild, '⚖️ Novo appeal', `**ID:** ${appeal.id}\n**Usuário:** ${interaction.user.tag}\n**Motivo:** ${appeal.reason}`);
    return interaction.reply({ embeds: [embed('⚖️ Appeal aberto', `Seu pedido foi registrado.\nID: \`${appeal.id}\``)], ephemeral: true });
  }

  if (sub === 'appeal_status') {
    const appeals = Object.values(guildData.appeals).filter(item => item.userId === interaction.user.id).slice(-5);
    if (!appeals.length) return interaction.reply({ content: 'Você não possui appeals registrados.', ephemeral: true });
    return interaction.reply({ embeds: [embed('⚖️ Seus appeals', appeals.map(item => `**${item.id}** — ${item.status}`).join('\n'))], ephemeral: true });
  }

  if (sub === 'appeal_review') {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({ content: 'Sem permissão para revisar appeals.', ephemeral: true });
    }

    const id = interaction.options.getString('id');
    const status = interaction.options.getString('status');
    const response = interaction.options.getString('resposta') || 'Sem resposta detalhada.';
    const appeal = guildData.appeals[id];
    if (!appeal) return interaction.reply({ content: 'Appeal não encontrado.', ephemeral: true });

    appeal.status = status;
    appeal.response = response.slice(0, 700);
    appeal.reviewedBy = interaction.user.id;
    appeal.reviewedAt = Date.now();
    save();

    await logToChannel(interaction.guild, '⚖️ Appeal revisado', `**ID:** ${id}\n**Status:** ${status}\n**Staff:** ${interaction.user.tag}\n**Resposta:** ${appeal.response}`);
    return interaction.reply({ content: `Appeal ${id} atualizado para ${status}.`, ephemeral: true });
  }
}

module.exports = { handleAppealCommand, createAppeal };
