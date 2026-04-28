# 🎵 Advanced Music Station Bot

## AVISO!!! ESTÁ BUGADO, NÃO USE ELE!!!

> Bot de música complexo inspirado em bots avançados com fila, rádio, DJ mode, Lavalink opcional, providers configuráveis e arquitetura profissional.

---

## Objetivo

Evoluir o Music Station de um player simples para uma estação musical mais completa.

Este projeto deve continuar seguro e responsável: use apenas fontes, rádios, arquivos, playlists e streams que você tem permissão para tocar e que respeitam os termos das plataformas usadas.

---

## Modos de execução

| Modo | Descrição |
|---|---|
| Local Voice | usa `@discordjs/voice` com URL direta/stream permitido |
| Radio Mode | toca presets de rádio permitidos |
| Lavalink Mode | arquitetura preparada para Lavalink opcional |
| Dashboard-ready | pensado para painel web no futuro |

---

## Recursos atuais

- `/music join`
- `/music leave`
- `/music play url:<url>`
- `/music radio preset:<preset>`
- `/music pause`
- `/music resume`
- `/music skip`
- `/music stop`
- `/music queue`
- `/music nowplaying`
- `/music volume`
- `/music loop`
- `/music clear`
- `/music djmode`

---

## Recursos avançados planejados

- Lavalink opcional
- playlists permitidas
- histórico por servidor
- favoritos por servidor
- votoskip
- filtros de áudio quando suportado
- painel com botões
- dashboard web opcional
- sistema de permissões DJ
- limite de fila por cargo
- logs de música
- bloqueio de fontes não permitidas

---

## Arquitetura ideal

```txt
music-station-bot/
├── src/
│   ├── index.js
│   ├── player.js
│   ├── providers/
│   │   ├── direct-url-provider.js
│   │   ├── radio-provider.js
│   │   └── lavalink-provider.js
│   ├── services/
│   │   ├── queue-service.js
│   │   ├── permission-service.js
│   │   └── history-service.js
│   └── config/
│       └── radios.js
```

---

## Uso responsável

Não use o bot para burlar restrições, baixar conteúdo sem permissão ou violar termos de plataformas.

O foco do projeto é arquitetura, comunidade e uso permitido.

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
DEFAULT_VOLUME=70
MAX_QUEUE_SIZE=50
DJ_ROLE_NAME=DJ
PLAYER_MODE=local
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
```

---

## Próximo passo técnico

1. Separar providers
2. Criar `queue-service`
3. Criar histórico local
4. Criar configuração por guild
5. Preparar Lavalink opcional

> RRALALS7 sempre ajudará vocês.
