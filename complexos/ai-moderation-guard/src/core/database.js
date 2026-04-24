const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'moderation-os.json');

function defaultData() {
  return {};
}

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData(), null, 2));
}

function readData() {
  ensureData();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return defaultData();
  }
}

function writeData(data) {
  ensureData();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getGuild(data, guildId) {
  data[guildId] ||= {
    config: {
      mode: process.env.MODERATION_MODE || 'safe',
      panic: false,
      reputationPublic: true
    },
    history: {},
    events: [],
    appeals: {},
    reputation: {}
  };
  return data[guildId];
}

module.exports = { readData, writeData, getGuild };
