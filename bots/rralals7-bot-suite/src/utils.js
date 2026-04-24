const axios = require('axios');

function isAdmin(interaction) {
  return interaction.memberPermissions?.has('Administrator');
}

function normalizeUrl(input) {
  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    return url;
  } catch {
    return null;
  }
}

function getDomain(input) {
  const url = normalizeUrl(input);
  if (!url) return null;
  return url.hostname.replace(/^www\./, '').toLowerCase();
}

function createEmbed(title, description, color = 0x7c3aed) {
  return {
    color,
    title,
    description,
    footer: { text: 'RRALALS7 sempre ajuda.' },
    timestamp: new Date().toISOString()
  };
}

async function lookupRobloxUser(username) {
  const userRes = await axios.post('https://users.roblox.com/v1/usernames/users', {
    usernames: [username],
    excludeBannedUsers: false
  });

  const user = userRes.data?.data?.[0];
  if (!user) return null;

  const thumbRes = await axios.get('https://thumbnails.roblox.com/v1/users/avatar-headshot', {
    params: {
      userIds: user.id,
      size: '420x420',
      format: 'Png',
      isCircular: false
    }
  });

  const thumbnail = thumbRes.data?.data?.[0]?.imageUrl || null;

  return {
    id: user.id,
    name: user.name,
    displayName: user.displayName,
    profileUrl: `https://www.roblox.com/users/${user.id}/profile`,
    thumbnail
  };
}

async function checkSafeBrowsing(url, apiKey) {
  if (!apiKey) return { verdict: 'unknown', reason: 'SAFE_BROWSING_API_KEY não configurada.' };

  const body = {
    client: {
      clientId: 'rralals7-bot-suite',
      clientVersion: '1.0.0'
    },
    threatInfo: {
      threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url }]
    }
  };

  const res = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, body);
  if (res.data?.matches?.length) return { verdict: 'malicious', reason: 'Match encontrado em base de ameaça.' };
  return { verdict: 'safe', reason: 'Nenhuma ameaça encontrada pela API configurada.' };
}

module.exports = {
  isAdmin,
  normalizeUrl,
  getDomain,
  createEmbed,
  lookupRobloxUser,
  checkSafeBrowsing
};
