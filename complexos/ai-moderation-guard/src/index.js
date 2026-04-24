const dotenv = require('dotenv');
dotenv.config();

const { Client, GatewayIntentBits } = require('discord.js');
const { readData, writeData, getGuild } = require('./core/database');
const { embed } = require('./core/ui');
const { handleMessageGuard, analyzeText } = require('./modules/ai-message-guard');
const { handleStaffCommand } = require('./modules/staff-assistant');
const { handleAppealCommand } = require('./modules/appeal-system');
const { handleReputationCommand } = require('./modules/reputation-system');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

function save(data) {
  writeData(data);
}

client.once('ready', () => {
  console.log(`RRALALS7 Moderation OS online como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  try {
    if (!message.guild || message.author.bot) return;
    const data = readData();
    const guildData = getGuild(data, message.guild.id);
    await handleMessageGuard(message, guildData, () => save(data));
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== 'modos') return;

    const data = readData();
    const guildData = getGuild(data, interaction.guildId);
    const sub = interaction.options.getSubcommand();

    if (sub === 'status') {
      return interaction.reply({
        embeds: [embed('🛡️ Moderation OS Status', [
          `**Modo:** ${guildData.config.mode}`,
          `**Eventos salvos:** ${guildData.events.length}`,
          `**Appeals:** ${Object.keys(guildData.appeals).length}`,
          `**Perfis de reputação:** ${Object.keys(guildData.reputation).length}`
        ].join('\n'))],
        ephemeral: true
      });
    }

    if (sub === 'mode') {
      guildData.config.mode = interaction.options.getString('modo');
      save(data);
      return interaction.reply({ content: `Modo alterado para **${guildData.config.mode}**.`, ephemeral: true });
    }

    if (sub === 'analyze') {
      const text = interaction.options.getString('texto');
      const { analysis, decision } = await analyzeText(text, guildData.config.mode);
      return interaction.reply({
        embeds: [embed('🔎 Análise manual', [
          `**Score:** ${decision.score}`,
          `**Confiança:** ${decision.confidence}`,
          `**Ação:** ${decision.action}`,
          `**Categoria:** ${analysis.category || 'unknown'}`,
          `**Motivo:** ${analysis.reason || 'Sem motivo.'}`
        ].join('\n'))],
        ephemeral: true
      });
    }

    if (sub === 'staff_analyze') {
      return handleStaffCommand(interaction, guildData);
    }

    if (['appeal_open', 'appeal_status', 'appeal_review'].includes(sub)) {
      return handleAppealCommand(interaction, guildData, () => save(data));
    }

    if (['rep_give', 'rep_profile', 'rep_leaderboard', 'rep_reset'].includes(sub)) {
      return handleReputationCommand(interaction, guildData, () => save(data));
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Erro no Moderation OS.', ephemeral: true }).catch(() => null);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
