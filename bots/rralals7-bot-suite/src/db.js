const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'database.json');

const defaultData = {
  guilds: {},
  tickets: {},
  giveaways: {},
  polls: {},
  linkChecks: []
};

function ensureDb() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
  }
}

function readDb() {
  ensureDb();
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch {
    return structuredClone(defaultData);
  }
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function getGuild(data, guildId) {
  if (!data.guilds[guildId]) {
    data.guilds[guildId] = {
      ticketCategoryId: null,
      ticketLogChannelId: null,
      staffRoleId: null,
      rolePanels: {},
      safeDomains: ['discord.com', 'discord.gg', 'github.com', 'roblox.com'],
      blockedDomains: []
    };
  }
  return data.guilds[guildId];
}

module.exports = {
  readDb,
  writeDb,
  getGuild
};
