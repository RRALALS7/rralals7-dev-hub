# 🤖 Bots Prontos — RRALALS7 Dev Hub

> Bots em **Node.js** e **Python** prontos para estudar, adaptar e rodar.

---

## ✅ Ponto atual

Os bots simples principais foram testados em ambiente real e marcados como aprovados.

Este diretório é a parte mais estável do hub: aqui ficam os bots rápidos, documentados e bons para portfólio, estudo e adaptação.

| Bot | Pasta | Stack | Status |
|---|---|---|---|
| RRALALS7 Bot Suite | [`rralals7-bot-suite`](./rralals7-bot-suite) | Node.js | ✅ Testado e aprovado |
| Ticket Bot | [`ticket-bot`](./ticket-bot) | Node.js | ✅ Testado e aprovado |
| Auto Roles Bot | [`auto-roles-bot`](./auto-roles-bot) | Node.js | ✅ Testado e aprovado |
| Giveaway Bot | [`giveaway-bot`](./giveaway-bot) | Node.js | ✅ Testado e aprovado |
| Poll Bot | [`poll-bot`](./poll-bot) | Node.js | ✅ Testado e aprovado |
| Economy Bot | [`economy-bot`](./economy-bot) | Node.js | ✅ Testado e aprovado |
| Anti Scam Bot | [`anti-scam-bot`](./anti-scam-bot) | Node.js | ✅ Testado e aprovado |
| Roblox Public Info Bot | [`roblox-public-info-bot`](./roblox-public-info-bot) | Node.js | ✅ Testado e aprovado |
| Roblox Verify Bot | [`roblox-verify-bot`](./roblox-verify-bot) | Node.js | ✅ Testado e aprovado |
| Study Helper Bot | [`study-helper-bot`](./study-helper-bot) | Node.js | ✅ Testado e aprovado |
| Minecraft Status Bot | [`minecraft-status-bot-python`](./minecraft-status-bot-python) | Python | ✅ Testado e aprovado; Java Edition |
| Game Tournament Bot | [`game-tournament-bot`](./game-tournament-bot) | Node.js | ✅ Testado e aprovado |
| AI Moderator Bot | [`ai-moderator-bot`](./ai-moderator-bot) | Node.js | ⚠️ Base simples; não é o sistema principal de moderação |

---

## Stack padrão

- Node.js;
- discord.js;
- dotenv;
- JSON local para dados simples;
- Python em bots gamer/consulta quando fizer sentido.

---

## Tutorial padrão — Bot Node.js

Use este passo a passo na maioria dos bots desta pasta.

### 1. Entrar na pasta

```bash
cd bots/nome-do-bot
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar `.env`

```bash
cp .env.example .env
```

Preencha:

```env
DISCORD_TOKEN=token_do_bot
CLIENT_ID=id_da_aplicacao
GUILD_ID=id_do_servidor_de_teste_opcional
```

### 4. Registrar comandos

```bash
npm run register
```

### 5. Iniciar bot

```bash
npm start
```

### 6. Testar

Abra um servidor privado e teste os comandos listados no README do bot.

---

## Tutorial padrão — Bot Python

Use no Minecraft Status Bot Python.

```bash
cd bots/minecraft-status-bot-python
pip install -r requirements.txt
cp .env.example .env
python src/main.py
```

---

## Segurança

- Nunca publique `.env`;
- nunca compartilhe token;
- use permissões mínimas;
- teste antes de colocar em servidor grande;
- não use os bots para spam, abuso, roubo de conta ou coleta de dados privados;
- revise cargos e permissões antes de usar em servidor real.

---

## Próximo nível

Depois do checkpoint final, os próximos upgrades bons são:

- releases por bot aprovado;
- changelog por versão;
- versões SQLite para bots com dados persistentes;
- logs administrativos onde fizer sentido;
- READMEs com exemplos de comandos e saídas esperadas;
- vitrine textual no site para compensar a falta de prints/fotos.

> RRALALS7 sempre ajuda.
