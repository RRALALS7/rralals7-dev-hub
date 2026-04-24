const { embed } = require('./ui');

const LOG_CHANNEL_NAME = process.env.LOG_CHANNEL_NAME || 'mod-logs';

async function logToChannel(guild, title, description, color = 0x7c3aed) {
  const channel = guild.channels.cache.find(c => c.name === LOG_CHANNEL_NAME);
  if (!channel) return false;
  await channel.send({ embeds: [embed(title, description, color)] }).catch(() => null);
  return true;
}

module.exports = { logToChannel };
