# 🤖 Bot Plans — Arquivo de Planejamento

> Esta pasta guarda os planos técnicos que deram origem aos bots e sistemas do RRALALS7 Dev Hub.

---

## Estado atual

Antes, esta pasta representava bots que ainda seriam feitos.

Agora, boa parte deles já virou projeto real em:

- [`bots/`](../bots)
- [`complexos/`](../complexos)
- [`apps/`](../apps)

Então `bot-plans/` funciona como **arquivo de planejamento, histórico técnico e referência de arquitetura**.

---

## Checkpoint final

```txt
bots simples → feitos, testados e aprovados
complexos principais → organizados
Community Master Bot → aprovado
Roblox Rigid Verification → aprovado
Moderation OS → corrigido, exige reteste cuidadoso
Music Station Bot → remover/refazer do zero
```

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

- **Node.js** para a maioria dos bots Discord;
- **discord.js** para comandos e interações;
- **Python** para bots gamer/consulta quando fizer sentido;
- **JSON local** para starters simples;
- **SQLite** como próximo passo para bots médios;
- **PostgreSQL** para sistemas maiores no futuro;
- **Express/React** quando houver dashboard.

---

## Planos que já viraram projeto

| Plano | Projeto real | Estado |
|---|---|---|
| Ticket Bot | [`bots/ticket-bot`](../bots/ticket-bot) | ✅ Testado |
| Auto-Cargos Bot | [`bots/auto-roles-bot`](../bots/auto-roles-bot) | ✅ Testado |
| Roblox Lookup | [`bots/roblox-public-info-bot`](../bots/roblox-public-info-bot) | ✅ Testado |
| Anti-Scam Link Checker | [`bots/anti-scam-bot`](../bots/anti-scam-bot) | ✅ Testado |
| IA Moderador | [`complexos/ai-moderation-guard`](../complexos/ai-moderation-guard) | 🛠️ Corrigido; reteste cuidadoso |
| Giveaway Bot | [`bots/giveaway-bot`](../bots/giveaway-bot) | ✅ Testado |
| Economy Bot | [`bots/economy-bot`](../bots/economy-bot) | ✅ Testado |
| Music Bot | [`complexos/music-station-bot`](../complexos/music-station-bot) | ❌ Remover/refazer |
| Study Helper | [`bots/study-helper-bot`](../bots/study-helper-bot) | ✅ Testado |

---

## Padrão de cada plano

Cada plano deve continuar servindo como base para:

- objetivo;
- stack;
- comandos;
- permissões;
- banco de dados;
- embeds;
- estrutura de pastas;
- roadmap;
- checklist de segurança;
- features futuras;
- decisão final: pronto, em teste, corrigido ou removido.

---

## Próxima utilidade desta pasta

Usar `bot-plans/` para desenhar sistemas antes de virar código em `bots/` ou `complexos/`.

Os próximos planos devem priorizar:

1. releases para bots aprovados;
2. SQLite para bots com dados persistentes;
3. dashboards/web quando fizer sentido;
4. bot de música V2 apenas se for refeito do zero;
5. exemplos textuais e documentação forte no lugar de prints/fotos.

> RRALALS7 sempre ajuda.
