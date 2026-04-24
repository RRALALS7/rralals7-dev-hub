# 🤖 Bot Plans — Arquivo de Planejamento

> Esta pasta guarda os planos técnicos que deram origem aos bots e sistemas do RRALALS7 Dev Hub.

---

## Estado atual

Antes, esta pasta representava os bots que ainda seriam feitos.

Agora, boa parte deles já virou projeto real em:

- [`bots/`](../bots)
- [`complexos/`](../complexos)
- [`apps/`](../apps)

Então `bot-plans/` funciona como **arquivo de planejamento e referência técnica**.

---

## Áreas atuais do repo

| Pasta | Função atual |
|---|---|
| `bots/` | bots simples e funcionais para rodar/adaptar |
| `complexos/` | sistemas avançados com módulos, logs e arquitetura |
| `apps/` | apps web e ferramentas auxiliares |
| `bot-plans/` | planos técnicos e decisões de arquitetura |
| `architecture/` | visão técnica dos sistemas |
| `test-cases/` | casos de teste e bordas importantes |
| `docs/` | documentação geral |
| `site/` | vitrine web do hub |

---

## Stack padrão atual

- **Node.js** para a maioria dos bots Discord
- **discord.js** para comandos e interações
- **Python** para bots gamer/consulta quando fizer sentido
- **JSON local** para starters simples
- **SQLite** como próximo passo para bots médios
- **PostgreSQL** para sistemas maiores no futuro
- **Express/React** quando houver dashboard

---

## Planos que já viraram projeto

| Plano | Projeto real |
|---|---|
| Ticket Bot | [`bots/ticket-bot`](../bots/ticket-bot) |
| Auto-Cargos Bot | [`bots/auto-roles-bot`](../bots/auto-roles-bot) |
| Roblox Lookup | [`bots/roblox-public-info-bot`](../bots/roblox-public-info-bot) |
| Anti-Scam Link Checker | [`bots/anti-scam-bot`](../bots/anti-scam-bot) |
| IA Moderador | [`complexos/ai-moderation-guard`](../complexos/ai-moderation-guard) |
| Giveaway Bot | [`bots/giveaway-bot`](../bots/giveaway-bot) |
| Economy Bot | [`bots/economy-bot`](../bots/economy-bot) |
| Music Bot | [`complexos/music-station-bot`](../complexos/music-station-bot) |
| Study Helper | [`bots/study-helper-bot`](../bots/study-helper-bot) |

---

## Padrão de cada plano

Cada plano deve continuar servindo como base para:

- objetivo
- stack
- comandos
- permissões
- banco de dados
- embeds
- estrutura de pastas
- roadmap
- checklist de segurança
- features futuras

---

## Próxima utilidade desta pasta

Usar `bot-plans/` para desenhar sistemas antes de virar código em `bots/` ou `complexos/`.

> RRALALS7 sempre ajuda.
