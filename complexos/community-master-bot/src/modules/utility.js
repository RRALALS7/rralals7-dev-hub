const { SlashCommandBuilder } = require('discord.js');
const { embed } = require('../core/ui');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('master-ping')
      .setDescription('Mostra ping simples do bot'),
    async execute(interaction) {
      return interaction.reply({ content: '🏓 Pong!', ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('master-avatar')
      .setDescription('Mostra avatar de um usuário')
      .addUserOption(option => option.setName('usuario').setDescription('Usuário opcional')),
    async execute(interaction) {
      const user = interaction.options.getUser('usuario') || interaction.user;
      return interaction.reply({
        embeds: [embed(`🖼️ Avatar de ${user.username}`, user.displayAvatarURL({ size: 1024 }))]
      });
    }
  }
];
