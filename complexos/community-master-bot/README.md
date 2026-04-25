# 🤖 Community Master Bot

> Bot complexo multiuso para comunidades Discord, inspirado em bots all-in-one profissionais.

---

## Objetivo

Criar um bot central para servidor com vários módulos úteis em uma única base organizada.

Ele não substitui os bots separados do repositório. A ideia é ser uma versão integrada, com módulos que podem ser ligados, desligados e evoluídos com o tempo.

---

## Módulos iniciais

| Módulo | Função |
|---|---|
| Core | status e informações do bot |
| Utility | ping e avatar |
| Polls | enquetes rápidas |
| Economy | coins fictícias, saldo e daily |

---

## Comandos atuais

### Core

```txt
/master-status
```

### Utility

```txt
/master-ping
/master-avatar
```

### Economy

```txt
/master-balance
/master-daily
```

### Poll

```txt
/master-poll
```

---

## Arquitetura atual

```txt
community-master-bot/
├── .env.example
├── package.json
├── src/
│   ├── index.js
│   ├── register-commands.js
│   ├── core/
│   │   ├── db.js
│   │   └── ui.js
│   └── modules/
│       ├── core.js
│       ├── utility.js
│       ├── economy.js
│       └── polls.js
```

---

## Variáveis de ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Depois preencha:

```env
DISCORD_TOKEN=coloque_o_token_do_bot_aqui
BOT_TOKEN=opcional_mesmo_valor_do_discord_token
CLIENT_ID=coloque_o_application_client_id_aqui
GUILD_ID=opcional_id_do_servidor_para_registro_rapido
```

Observação:

- `DISCORD_TOKEN` é usado pelo bot.
- `BOT_TOKEN` é aceito como alternativa.
- `CLIENT_ID` é necessário para registrar comandos.
- `GUILD_ID` é opcional e ajuda comandos aparecerem mais rápido em um servidor de teste.

Nunca publique seu `.env` real.

---

## Segurança

- Não usar para spam, raid ou abuso
- Permissões administrativas devem ser limitadas
- Dados são salvos localmente em JSON nesta versão starter
- Para produção real, migrar para SQLite ou PostgreSQL

---

## Instalação

```bash
npm install
cp .env.example .env
npm run register
npm start
```

---

## Próximos upgrades

- tickets integrados
- sorteios integrados
- moderação com logs
- configuração por servidor
- dashboard opcional
- banco SQLite

> RRALALS7 sempre ajuda.
