const { SlashCommandBuilder } = require('discord.js');
const { read, write, guild } = require('../core/db');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('master-balance')
      .setDescription('Mostra seu saldo fictício'),
    async execute(interaction) {
      const data = read();
      const g = guild(data, interaction.guildId);
      g.economy[interaction.user.id] ||= 0;
      write(data);
      return interaction.reply({ content: `💰 Saldo: **${g.economy[interaction.user.id]} coins**`, ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('master-daily')
      .setDescription('Recebe coins fictícias diárias'),
    async execute(interaction) {
      const data = read();
      const g = guild(data, interaction.guildId);
      const now = Date.now();
      const last = g.daily[interaction.user.id] || 0;
      if (now - last < 86400000) return interaction.reply({ content: 'Você já pegou o daily hoje.', ephemeral: true });
      g.economy[interaction.user.id] ||= 0;
      g.economy[interaction.user.id] += 100;
      g.daily[interaction.user.id] = now;
      write(data);
      return interaction.reply({ content: '🎁 Você recebeu **100 coins**!', ephemeral: true });
    }
  }
];
