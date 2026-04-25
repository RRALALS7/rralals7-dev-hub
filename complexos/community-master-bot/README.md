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
| Core | status, configuração e informações do bot |
| Moderation | comandos leves de moderação e logs |
| Tickets | criação de tickets simples |
| Giveaways | sorteios básicos |
| Polls | enquetes rápidas |
| Economy | coins fictícias e saldo |
| Utilities | avatar, ping, userinfo e serverinfo |

---

## Comandos planejados

### Core

```txt
/master status
/master modules
/master config
```

### Utility

```txt
/master ping
/master avatar
/master userinfo
/master serverinfo
```

### Economy

```txt
/master balance
/master daily
/master leaderboard
```

### Poll

```txt
/master poll
```

---

## Arquitetura

```txt
community-master-bot/
├── src/
│   ├── index.js
│   ├── register-commands.js
│   ├── core/
│   │   ├── database.js
│   │   └── ui.js
│   └── modules/
│       ├── core.js
│       ├── utility.js
│       ├── economy.js
│       └── polls.js
```

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
