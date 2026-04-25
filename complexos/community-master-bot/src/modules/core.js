const { SlashCommandBuilder } = require('discord.js');
const { embed } = require('../core/ui');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('master-status')
      .setDescription('Mostra status do Community Master Bot'),
    async execute(interaction) {
      return interaction.reply({
        embeds: [embed('🤖 Community Master', 'Sistema online. Módulos ativos: core, utility, economy e polls.')],
        ephemeral: true
      });
    }
  }
];
