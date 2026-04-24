# 🎵 Music Station Bot — Complexo

> Bot de música avançado para Discord com fila, rádio, DJ mode e controles profissionais.

---

## Objetivo

Criar um bot de música completo, mas seguro e responsável.

Este projeto é focado em:

- rádios online permitidas
- URLs diretas de áudio permitidas
- arquivos/streams que o servidor tem direito de usar
- estudo de arquitetura de bot de voz no Discord

---

## Recursos

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

## Recursos complexos

- fila por servidor
- estado por guild
- modo DJ
- permissões configuráveis
- presets de rádio
- loop de faixa/fila
- proteção contra fila gigante
- logs opcionais
- estrutura modular

---

## Uso responsável

Não use este bot para tocar conteúdo sem permissão.

Evite fontes que violem regras de plataformas, direitos autorais ou termos de serviço.

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
```

---

## Presets de rádio

Os presets ficam em:

```txt
src/config/radios.js
```

Adicione apenas rádios públicas/permitidas.

---

## Permissões recomendadas

- Connect
- Speak
- Use Voice Activity
- Send Messages
- Use Slash Commands

---

## Futuro

- painel com botões
- histórico
- favoritos por servidor
- dashboard opcional
- integração com Lavalink configurável

> RRALALS7 sempre ajuda.
