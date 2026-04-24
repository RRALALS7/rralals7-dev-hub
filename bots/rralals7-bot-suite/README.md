# 🤖 RRALALS7 Bot Suite

> **RRALALS7 sempre ajuda.**

Um bot Discord pronto para usar, feito em **Node.js + discord.js**, com módulos úteis para comunidades:

- 🎟️ Tickets
- 🔐 Auto-cargos
- 🧱 Roblox public lookup
- 🛡️ Anti-scam link checker
- 🎁 Sorteios
- 🗳️ Enquetes
- 🏓 Ping e status

---

## ⚠️ Uso responsável

Este projeto é focado em automação segura e útil. Não use para spam, raid, selfbot, bypass, roubo de contas, phishing ou coleta de dados privados.

---

## 🚀 Instalação

```bash
npm install
cp .env.example .env
```

Edite o `.env`:

```env
DISCORD_TOKEN=token_do_bot
CLIENT_ID=id_do_bot
GUILD_ID=id_do_servidor_opcional
SAFE_BROWSING_API_KEY=opcional
```

Registrar comandos:

```bash
npm run register
```

Rodar:

```bash
npm start
```

---

## 📌 Comandos

| Comando | Função |
|---|---|
| `/ping` | Testa o bot |
| `/help` | Mostra ajuda |
| `/ticket setup` | Cria painel de ticket |
| `/ticket close` | Fecha ticket atual |
| `/roles setup` | Cria painel de auto-cargos |
| `/roblox user` | Consulta perfil público Roblox |
| `/checklink` | Verifica link manualmente |
| `/poll` | Cria enquete |
| `/giveaway` | Cria sorteio simples |

---

## 🗂️ Estrutura

```txt
rralals7-bot-suite/
├── src/
│   ├── index.js
│   ├── register-commands.js
│   ├── db.js
│   └── utils.js
├── data/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🛡️ Segurança

- Nunca publique `.env`
- Use permissões mínimas no bot
- Teste em servidor privado
- Não colete dados privados
- Use apenas dados públicos do Roblox
- Configure cargos abaixo do cargo do bot

---

## ❤️ Criado por

**RRALALS7**
