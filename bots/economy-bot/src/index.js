const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const { Client, EmbedBuilder, GatewayIntentBits } = require('discord.js');
const { shop } = require('./shop');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'economy.json');

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
      const lines = shop.map(item => `**${item.name}** (\`${item.id}\`) — ${item.price} coins\n${item.description}`);
      return interaction.reply({ embeds: [embed('🛒 Loja ficticia', lines.join('\n\n'))] });
    }

    if (interaction.commandName === 'buy') {
      const id = interaction.options.getString('item');
      const item = shop.find(entry => entry.id === id);
      if (!item) return interaction.reply({ content: 'Item nao encontrado.', ephemeral: true });
      if (profile.coins < item.price) return interaction.reply({ content: 'Saldo insuficiente.', ephemeral: true });
      profile.coins -= item.price;
      profile.inventory.push(item.id);
      writeData(data);
      return interaction.reply({ embeds: [embed('✅ Compra feita', `Voce comprou **${item.name}**. Use \`/use item:${item.id}\` para usar.`)] });
    }

    if (interaction.commandName === 'inventory') {
      if (!profile.inventory.length) {
        return interaction.reply({ embeds: [embed('🎒 Inventario', 'Inventario vazio. Compre algo na `/shop`.')], ephemeral: true });
      }

      const counts = {};
      for (const id of profile.inventory) counts[id] = (counts[id] || 0) + 1;
      const lines = Object.entries(counts).map(([id, qty]) => {
        const item = shop.find(entry => entry.id === id);
        const label = item ? item.name : id;
        const tag = item && item.consumable ? ' (consumivel)' : '';
        return `- **${label}**${tag} ×${qty}`;
      });

      return interaction.reply({ embeds: [embed('🎒 Inventario', lines.join('\n'))], ephemeral: true });
    }

    if (interaction.commandName === 'use') {
      const id = interaction.options.getString('item');
      const item = shop.find(entry => entry.id === id);
      if (!item) return interaction.reply({ content: 'Item desconhecido.', ephemeral: true });
      const idx = profile.inventory.indexOf(id);
      if (idx === -1) return interaction.reply({ content: `Voce nao tem **${item.name}** no inventario.`, ephemeral: true });

      if (id === 'crate') {
        const reward = Math.floor(Math.random() * 251) + 50;
        profile.coins += reward;
        profile.inventory.splice(idx, 1);
        writeData(data);
        return interaction.reply({ embeds: [embed('📦 Caixa Misteriosa aberta', `Voce ganhou **${reward} coins ficticias**!\nSaldo atual: **${profile.coins} coins**.`)] });
      }

      if (id === 'vip') {
        return interaction.reply({ embeds: [
          embed(`💎 Cartao VIP de ${interaction.user.username}`, `╔═══════════════╗\n║   ★ VIP FAKE ★   ║\n║                 ║\n║  Holder: ${interaction.user.username}\n║  Status: Ativo\n╚═══════════════╝\n\n*Item permanente, nao consumido.*`)
        ] });
      }

      if (id === 'badge') {
        return interaction.reply({ embeds: [
          embed(`🎮 Badge Gamer de ${interaction.user.username}`, `🏆 ✨ 🎮 ✨ 🏆\n**${interaction.user.username}** equipou a Badge Gamer.\n*Item permanente, nao consumido.*`)
        ] });
      }

      return interaction.reply({ content: 'Esse item nao tem efeito definido ainda.', ephemeral: true });
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
