const projects = [
  {
    title: '🎟️ Ticket Bot',
    description: '✅ Testado. Suporte privado com canais, botões e fechamento organizado.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/ticket-bot/README.md'
  },
  {
    title: '🔐 Auto Roles Bot',
    description: '✅ Testado. Auto-cargos por menu dropdown com até 10 cargos.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/auto-roles-bot/README.md'
  },
  {
    title: '🎁 Giveaway Bot',
    description: '✅ Testado. Sorteios com botão de participação, lista e reroll.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/giveaway-bot/README.md'
  },
  {
    title: '🗳️ Poll Bot',
    description: '✅ Testado. Enquetes com até 5 opções e reações automáticas.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/poll-bot/README.md'
  },
  {
    title: '💰 Economy Bot',
    description: '✅ Testado. Coins fictícias, daily, loja corrigida, inventário e ranking.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/economy-bot/README.md'
  },
  {
    title: '🛡️ Anti Scam Bot',
    description: '✅ Testado. Verificação defensiva de links com whitelist e blacklist.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/anti-scam-bot/README.md'
  },
  {
    title: '🧱 Roblox Public Info Bot',
    description: '✅ Testado. Consulta dados públicos de perfis Roblox com embed bonito.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/roblox-public-info-bot/README.md'
  },
  {
    title: '✅ Roblox Verify Bot',
    description: '✅ Testado. Verificação Roblox usando apenas dados públicos do perfil.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/roblox-verify-bot/README.md'
  },
  {
    title: '📚 Study Helper Bot',
    description: '✅ Testado. Flashcards e quiz simples para estudos no Discord.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/study-helper-bot/README.md'
  },
  {
    title: '🎮 Minecraft Status Bot',
    description: '✅ Testado. Status público de servidores Minecraft Java em Python.',
    tag: 'Python • Java Edition',
    category: 'bot',
    url: '../bots/minecraft-status-bot-python/README.md'
  },
  {
    title: '🏆 Game Tournament Bot',
    description: '✅ Testado. Torneios, inscrições, participantes e chaveamento simples.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/game-tournament-bot/README.md'
  },
  {
    title: '🤖 RRALALS7 Bot Suite',
    description: '✅ Testado. Suite multiuso com tickets, roles, Roblox, sorteios e mais.',
    tag: 'Node.js • aprovado',
    category: 'bot',
    url: '../bots/rralals7-bot-suite/README.md'
  },
  {
    title: '🛡️ Moderation OS',
    description: '🛠️ Corrigido. AI Guard com score, confiança, appeals, staff assistant e reputação.',
    tag: 'Complexo • reteste',
    category: 'complexo',
    url: '../complexos/ai-moderation-guard/README.md'
  },
  {
    title: '🤖 Community Master Bot',
    description: '✅ Testado. All-in-one modular com core, utilidades, economy, polls e base para crescer.',
    tag: 'Complexo • aprovado',
    category: 'complexo',
    url: '../complexos/community-master-bot/README.md'
  },
  {
    title: '🧱 Roblox Rigid Verification',
    description: '✅ Testado. Verificação rígida com cargos, canal automático, logs e registro corrigido.',
    tag: 'Complexo • aprovado',
    category: 'complexo',
    url: '../complexos/roblox-rigid-verification/README.md'
  },
  {
    title: '🎵 Music Station Bot',
    description: '🧪 Experimental. Código preservado; package.json removido para não quebrar CI.',
    tag: 'Complexo • experimental',
    category: 'complexo',
    url: '../complexos/music-station-bot/README.md'
  },
  {
    title: '🧰 Dev Toolbox Web',
    description: 'JSON formatter, Base64, UUID e utilidades rápidas.',
    tag: 'App',
    category: 'app',
    url: '../apps/dev-toolbox-web/README.md'
  },
  {
    title: '🧠 Prompt Library',
    description: 'Biblioteca de prompts seguros para IA, estudos e dev.',
    tag: 'App',
    category: 'app',
    url: '../apps/prompt-library/README.md'
  },
  {
    title: '📊 Bot Status Dashboard',
    description: 'Starter de painel para status e cards dos bots.',
    tag: 'App',
    category: 'app',
    url: '../apps/bot-status-dashboard/README.md'
  },
  {
    title: '📚 Script Catalog',
    description: 'Catálogo visual para bots, apps, docs e templates.',
    tag: 'App',
    category: 'app',
    url: '../apps/script-catalog/README.md'
  },
  {
    title: '📌 Project Status',
    description: 'Painel geral do que está feito, testado, corrigido, isolado e próximo.',
    tag: 'Doc',
    category: 'doc',
    url: '../PROJECT_STATUS.md'
  },
  {
    title: '🗺️ Roadmap Oficial',
    description: 'Mapa do ponto fixo atual, próximas fases e ideias futuras.',
    tag: 'Doc',
    category: 'doc',
    url: '../ROADMAP.md'
  },
  {
    title: '✅ Final Review',
    description: 'Fechamento oficial: feito, testado, corrigido, explicado e salvo.',
    tag: 'Doc',
    category: 'doc',
    url: '../FINAL_REVIEW.md'
  },
  {
    title: '🏗️ Architecture',
    description: 'Explicações técnicas dos sistemas e estrutura do hub.',
    tag: 'Doc',
    category: 'doc',
    url: '../architecture/SYSTEMS_OVERVIEW.md'
  }
];

const grid = document.querySelector('#projectGrid');
const searchInput = document.querySelector('#searchInput');
const categoryFilter = document.querySelector('#categoryFilter');

function createCard(project) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.category = project.category;
  card.innerHTML = `
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <span class="tag">${project.tag}</span>
    <a class="card-link" href="${project.url}">Abrir README →</a>
  `;
  return card;
}

function renderProjects() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  grid.innerHTML = '';

  const filtered = projects.filter(project => {
    const matchesSearch = `${project.title} ${project.description} ${project.tag}`.toLowerCase().includes(query);
    const matchesCategory = category === 'all' || project.category === category;
    return matchesSearch && matchesCategory;
  });

  if (!filtered.length) {
    const empty = document.createElement('article');
    empty.className = 'card';
    empty.innerHTML = '<h3>Nada encontrado</h3><p>Tenta outro termo ou categoria.</p>';
    grid.appendChild(empty);
    return;
  }

  filtered.forEach(project => grid.appendChild(createCard(project)));
}

searchInput.addEventListener('input', renderProjects);
categoryFilter.addEventListener('change', renderProjects);

renderProjects();
