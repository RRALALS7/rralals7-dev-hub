const bots = [
  ['🎟️ Ticket Bot', 'Suporte privado com canais e botões.', 'Node.js'],
  ['🔐 Auto Roles Bot', 'Auto-cargos por menu dropdown.', 'Node.js'],
  ['🎁 Giveaway Bot', 'Sorteios com botão de participação.', 'Node.js'],
  ['🗳️ Poll Bot', 'Enquetes com reações automáticas.', 'Node.js'],
  ['💰 Economy Bot', 'Moeda fictícia, loja e ranking.', 'Node.js'],
  ['🛡️ Anti Scam Bot', 'Verificação defensiva de links.', 'Node.js'],
  ['🧱 Roblox Public Info Bot', 'Informações públicas de perfis Roblox.', 'Node.js'],
  ['✅ Roblox Verify Bot', 'Verificação Roblox com dados públicos.', 'Node.js'],
  ['📚 Study Helper Bot', 'Flashcards e quiz para estudos.', 'Node.js'],
  ['🎮 Minecraft Status Bot', 'Status público de servidores Minecraft.', 'Python'],
  ['🏆 Tournament Bot', 'Torneios, inscrições e chaveamento.', 'Node.js'],
  ['🤖 RRALALS7 Bot Suite', 'Suite multiuso com vários módulos.', 'Node.js']
];

const grid = document.querySelector('#botGrid');

for (const [title, desc, tag] of bots) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `<h3>${title}</h3><p>${desc}</p><span class="tag">${tag}</span>`;
  grid.appendChild(card);
}
