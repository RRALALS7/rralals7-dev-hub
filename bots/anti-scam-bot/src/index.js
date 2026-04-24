const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const { Client, EmbedBuilder, GatewayIntentBits } = require('discord.js');

const safeDomains = ['github.com', 'discord.com', 'discord.gg', 'roblox.com', 'minecraft.net', 'google.com'];
const blockedDomains = ['grabify.link', 'iplogger.org', '2no.co', 'yip.su'];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function normalize(input) {
  try { return new URL(input.startsWith('http') ? input : `https://${input}`); } catch { return null; }
}
function domainOf(input) {
  const url = normalize(input);
  if (!url) return null;
  return url.hostname.replace(/^www\./, '').toLowerCase();
}
function embed(title, description, color = 0x7c3aed) {
  return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setFooter({ text: 'RRALALS7 sempre ajuda.' }).setTimestamp();
}
async function safeBrowsingCheck(url) {
  if (!process.env.SAFE_BROWSING_API_KEY) return { verdict: 'unknown', reason: 'API opcional nao configurada.' };
  const body = {
    client: { clientId: 'rralals7-anti-scam-bot', clientVersion: '1.0.0' },
    threatInfo: {
      threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url }]
    }
  };
  const response = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.SAFE_BROWSING_API_KEY}`, body);
  if (response.data && response.data.matches && response.data.matches.length) return { verdict: 'danger', reason: 'Encontrado em base de ameacas.' };
  return { verdict: 'safe', reason: 'Nenhuma ameaca encontrada pela API.' };
}

client.once('ready', () => console.log(`Anti Scam Bot online como ${client.user.tag}`));

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'checklink') return;
    const input = interaction.options.getString('url');
    const url = normalize(input);
    const domain = domainOf(input);
    if (!url || !domain) return interaction.reply({ content: 'Link invalido.', ephemeral: true });

    await interaction.deferReply({ ephemeral: true });

    let result;
    if (safeDomains.includes(domain)) result = { verdict: 'safe', reason: 'Dominio conhecido na whitelist local.' };
    else if (blockedDomains.includes(domain)) result = { verdict: 'danger', reason: 'Dominio conhecido por rastreamento ou risco.' };
    else result = await safeBrowsingCheck(url.toString());

    const color = result.verdict === 'safe' ? 0x22c55e : result.verdict === 'danger' ? 0xef4444 : 0xf59e0b;
    await interaction.editReply({ embeds: [embed('🛡️ Resultado da verificacao', `**Dominio:** ${domain}\n**Resultado:** ${result.verdict}\n**Motivo:** ${result.reason}`, color)] });
  } catch (error) {
    console.error(error);
    if (interaction.deferred) await interaction.editReply('Erro ao verificar link.');
    else await interaction.reply({ content: 'Erro ao verificar link.', ephemeral: true }).catch(() => {});
  }
});

client.login(process.env.DISCORD_TOKEN);
