# 🧠 IA Moderador Bot — Plano Oficial

> Bot avançado com IA para ajudar admins e membros de forma segura.

---

## Objetivo

Criar um bot com IA para responder dúvidas frequentes, auxiliar moderação e organizar informações do servidor.

---

## Stack

- Node.js
- discord.js
- API de IA
- SQLite ou PostgreSQL
- Express opcional para dashboard

---

## Comandos

| Comando | Função | Permissão |
|---|---|---|
| `/ask` | Pergunta algo para a IA | Todos |
| `/faq add` | Adiciona resposta fixa | Staff |
| `/faq list` | Lista FAQs | Todos |
| `/ai config` | Configura limites da IA | Admin |
| `/ai logs` | Define canal de logs | Admin |

---

## Recursos

- Respostas com IA
- FAQ do servidor
- Limites por usuário
- Cooldown
- Logs de uso
- Bloqueio de temas perigosos
- Modo somente ajuda

---

## Banco de dados

```txt
guild_configs
faq_items
ai_logs
cooldowns
blocked_topics
```

---

## Roadmap

1. Criar base do bot
2. Criar comando `/ask`
3. Integrar IA
4. Criar limites e cooldowns
5. Criar FAQ
6. Criar logs
7. Adicionar filtros de segurança
8. Documentar uso responsável

---

## Segurança

- Não permitir instruções maliciosas
- Criar limites de uso
- Não expor dados privados
- Não agir como admin sem confirmação
- Registrar logs sem salvar conteúdo sensível demais

---

## Features futuras

- Dashboard de configuração
- Base de conhecimento do servidor
- Respostas por categoria
- Modo tutor de programação
- Resumos de canais autorizados
