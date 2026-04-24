# 🏆 RRALALS7 Game Tournament Bot

> Bot Discord em **Node.js** para organizar torneios gamer.

---

## Recursos

- `/tournament create` — cria torneio
- `/tournament join` — entra no torneio ativo
- `/tournament leave` — sai do torneio ativo
- `/tournament list` — lista participantes
- `/tournament bracket` — gera chaveamento simples
- `/tournament end` — encerra torneio

---

## Stack

- Node.js
- discord.js
- dotenv
- JSON local

---

## Instalação

```bash
npm install
cp .env.example .env
npm run register
npm start
```

---

## Variáveis

```env
DISCORD_TOKEN=token_do_bot
CLIENT_ID=id_do_bot
GUILD_ID=id_do_servidor_opcional
```

---

## Uso

```txt
/tournament create nome:Campeonato Roblox vagas:16
/tournament join
/tournament list
/tournament bracket
/tournament end
```

---

## Segurança

- Apenas admins podem criar/encerrar torneios
- Não envolve apostas ou dinheiro real
- Ideal para eventos de comunidade

> RRALALS7 sempre ajuda.
