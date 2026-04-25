const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', '..', 'data.json');

function read() {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function write(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function guild(data, id) {
  data[id] ||= { economy: {}, daily: {}, polls: [] };
  return data[id];
}

module.exports = { read, write, guild };
