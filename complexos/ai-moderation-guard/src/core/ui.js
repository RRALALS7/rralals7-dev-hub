const { EmbedBuilder } = require('discord.js');

function embed(title, description, color = 0x7c3aed) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'Sistema de moderação • RRALALS7' })
    .setTimestamp();
}

module.exports = { embed };
