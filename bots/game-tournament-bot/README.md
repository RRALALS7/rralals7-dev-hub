# 🏆 RRALALS7 Game Tournament Bot

> Bot Discord em **Node.js** para organizar torneios gamer.

---

## Status

```txt
✅ Testado e aprovado em ambiente real
```

Este bot já passou por teste prático e foi aprovado para entrar na lista de projetos validados do RRALALS7 Dev Hub.

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

---

## Próximos upgrades possíveis

- times/duplas
- MD3/MD5
- sistema de placar
- confirmação de resultado pelos dois jogadores
- logs de partidas
- histórico de torneios
- ranking de campeões

> RRALALS7 sempre ajuda.
