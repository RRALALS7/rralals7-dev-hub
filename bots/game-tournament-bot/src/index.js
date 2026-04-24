const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');
const {
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  PermissionsBitField
} = require('discord.js');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'tournaments.json');

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

function makeEmbed(title, description, color = 0x7c3aed) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'RRALALS7 sempre ajuda.' })
    .setTimestamp();
}

function createBracket(participants) {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  const pairs = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    const a = shuffled[i];
    const b = shuffled[i + 1];
    pairs.push(b ? `<@${a}> vs <@${b}>` : `<@${a}> passa direto`);
  }

  return pairs;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Tournament Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== 'tournament') return;

    const sub = interaction.options.getSubcommand();
    const data = readData();
    const guildId = interaction.guildId;
    const current = data[guildId];

    if (sub === 'create') {
      if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: 'Apenas administradores podem criar torneios.', ephemeral: true });
      }

      if (current) {
        return interaction.reply({ content: 'Já existe um torneio ativo neste servidor. Encerre primeiro com `/tournament end`.', ephemeral: true });
      }

      const name = interaction.options.getString('nome');
      const slots = interaction.options.getInteger('vagas');

      data[guildId] = {
        name,
        slots,
        participants: [],
        createdBy: interaction.user.id,
        createdAt: new Date().toISOString(),
        bracket: []
      };
      writeData(data);

      return interaction.reply({ embeds: [makeEmbed('🏆 Torneio criado', `**Nome:** ${name}\n**Vagas:** ${slots}\n\nUse \`/tournament join\` para participar.`)] });
    }

    if (!current) {
      return interaction.reply({ content: 'Não existe torneio ativo neste servidor.', ephemeral: true });
    }

    if (sub === 'join') {
      if (current.participants.includes(interaction.user.id)) {
        return interaction.reply({ content: 'Você já está inscrito no torneio.', ephemeral: true });
      }

      if (current.participants.length >= current.slots) {
        return interaction.reply({ content: 'O torneio já está com todas as vagas preenchidas.', ephemeral: true });
      }

      current.participants.push(interaction.user.id);
      writeData(data);

      return interaction.reply({ embeds: [makeEmbed('✅ Inscrição confirmada', `<@${interaction.user.id}> entrou no torneio **${current.name}**.\nVagas: ${current.participants.length}/${current.slots}`)] });
    }

    if (sub === 'leave') {
      if (!current.participants.includes(interaction.user.id)) {
        return interaction.reply({ content: 'Você não está inscrito neste torneio.', ephemeral: true });
      }

      current.participants = current.participants.filter(id => id !== interaction.user.id);
      writeData(data);

      return interaction.reply({ embeds: [makeEmbed('👋 Saiu do torneio', `<@${interaction.user.id}> saiu do torneio **${current.name}**.`)] });
    }

    if (sub === 'list') {
      const list = current.participants.length
        ? current.participants.map((id, index) => `${index + 1}. <@${id}>`).join('\n')
        : 'Nenhum participante ainda.';

      return interaction.reply({ embeds: [makeEmbed(`📋 Participantes — ${current.name}`, `${list}\n\n**Total:** ${current.participants.length}/${current.slots}`)] });
    }

    if (sub === 'bracket') {
      if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: 'Apenas administradores podem gerar chaveamento.', ephemeral: true });
      }

      if (current.participants.length < 2) {
        return interaction.reply({ content: 'É necessário pelo menos 2 participantes.', ephemeral: true });
      }

      current.bracket = createBracket(current.participants);
      writeData(data);

      return interaction.reply({ embeds: [makeEmbed(`⚔️ Chaveamento — ${current.name}`, current.bracket.map((pair, i) => `**Partida ${i + 1}:** ${pair}`).join('\n'))] });
    }

    if (sub === 'end') {
      if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: 'Apenas administradores podem encerrar torneios.', ephemeral: true });
      }

      const endedName = current.name;
      delete data[guildId];
      writeData(data);

      return interaction.reply({ embeds: [makeEmbed('🏁 Torneio encerrado', `O torneio **${endedName}** foi encerrado.`)] });
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({ content: 'Ocorreu um erro no bot de torneios.', ephemeral: true }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
