const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const { Client, EmbedBuilder, GatewayIntentBits } = require('discord.js');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'economy.json');
const shop = [
  { id: 'vip', name: 'VIP Fake', price: 500, description: 'Tag ficticia de destaque para brincadeira.' },
  { id: 'badge', name: 'Badge Gamer', price: 250, description: 'Insignia ficticia para mostrar no inventario.' },
  { id: 'crate', name: 'Caixa Misteriosa', price: 100, description: 'Item surpresa ficticio para eventos.' }
];

function ensureData() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '{}');
}

function readData() {
  ensureData();
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch {
    return {};
  }
}

function writeData(data) {
  ensureData();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function user(data, guildId, userId) {
  data[guildId] ||= {};
  data[guildId][userId] ||= { coins: 0, lastDaily: 0, inventory: [] };
  return data[guildId][userId];
}

function findItem(id) {
  return shop.find(entry => entry.id === id);
}

function embed(title, description) {
  return new EmbedBuilder()
    .setColor(0x7c3aed)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'RRALALS7 sempre ajuda.' })
    .setTimestamp();
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once('ready', () => console.log(`Economy Bot online como ${client.user.tag}`));

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const data = readData();
    const profile = user(data, interaction.guildId, interaction.user.id);

    if (interaction.commandName === 'balance') {
      const target = interaction.options.getUser('usuario') || interaction.user;
      const targetProfile = user(data, interaction.guildId, target.id);
      writeData(data);
      return interaction.reply({ embeds: [embed('💰 Saldo', `${target} tem **${targetProfile.coins} coins ficticias**.`)] });
    }

    if (interaction.commandName === 'daily') {
      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;
      if (now - profile.lastDaily < day) return interaction.reply({ content: 'Voce ja pegou o daily hoje.', ephemeral: true });
      profile.coins += 100;
      profile.lastDaily = now;
      writeData(data);
      return interaction.reply({ embeds: [embed('🎁 Daily recebido', 'Voce recebeu **100 coins ficticias**.')] });
    }

    if (interaction.commandName === 'sendcoins') {
      const target = interaction.options.getUser('usuario');
      const amount = interaction.options.getInteger('quantia');
      if (target.bot || target.id === interaction.user.id) return interaction.reply({ content: 'Escolha outro usuario valido.', ephemeral: true });
      if (profile.coins < amount) return interaction.reply({ content: 'Saldo insuficiente.', ephemeral: true });
      const targetProfile = user(data, interaction.guildId, target.id);
      profile.coins -= amount;
      targetProfile.coins += amount;
      writeData(data);
      return interaction.reply({ embeds: [embed('✅ Transferencia feita', `${interaction.user} enviou **${amount} coins ficticias** para ${target}.`)] });
    }

    if (interaction.commandName === 'shop') {
      const text = shop
        .map(item => `**${item.id}** — **${item.name}**\nPreço: ${item.price} coins\n${item.description}`)
        .join('\n\n');

      return interaction.reply({
        embeds: [embed('🛒 Loja ficticia', `${text}\n\nUse **/buy** e escolha um item na lista.`)]
      });
    }

    if (interaction.commandName === 'buy') {
      const id = interaction.options.getString('item');
      const item = findItem(id);
      if (!item) return interaction.reply({ content: 'Item nao encontrado.', ephemeral: true });
      if (profile.coins < item.price) return interaction.reply({ content: 'Saldo insuficiente.', ephemeral: true });
      profile.coins -= item.price;
      profile.inventory.push(item.id);
      writeData(data);
      return interaction.reply({ embeds: [embed('✅ Compra feita', `Voce comprou **${item.name}** por **${item.price} coins**.`)] });
    }

    if (interaction.commandName === 'inventory') {
      const text = profile.inventory.length
        ? profile.inventory.map(id => {
            const item = findItem(id);
            return `- ${item ? item.name : id}`;
          }).join('\n')
        : 'Inventario vazio.';
      return interaction.reply({ embeds: [embed('🎒 Inventario', text)], ephemeral: true });
    }

    if (interaction.commandName === 'leaderboard') {
      const guildData = data[interaction.guildId] || {};
      const ranking = Object.entries(guildData).sort((a, b) => b[1].coins - a[1].coins).slice(0, 10);
      const text = ranking.length ? ranking.map(([id, p], i) => `${i + 1}. <@${id}> — ${p.coins} coins`).join('\n') : 'Sem dados ainda.';
      return interaction.reply({ embeds: [embed('🏆 Leaderboard', text)] });
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) await interaction.reply({ content: 'Erro no Economy Bot.', ephemeral: true }).catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
