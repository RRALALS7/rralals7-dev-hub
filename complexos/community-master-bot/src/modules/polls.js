const { SlashCommandBuilder } = require('discord.js');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('master-poll')
      .setDescription('Cria enquete simples')
      .addStringOption(option => option.setName('pergunta').setDescription('Pergunta').setRequired(true)),
    async execute(interaction) {
      const question = interaction.options.getString('pergunta');
      const message = await interaction.reply({ content: `📊 **${question}**`, fetchReply: true });
      await message.react('👍');
      await message.react('👎');
    }
  }
];
