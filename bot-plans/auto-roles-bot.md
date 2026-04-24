# 🔐 Auto-Cargos Bot — Plano Oficial

> Bot para membros escolherem cargos por botões ou menus.

---

## Objetivo

Criar um sistema simples e bonito para auto-cargos em servidores Discord.

---

## Stack

- Node.js
- discord.js
- SQLite
- dotenv

---

## Comandos

| Comando | Função | Permissão |
|---|---|---|
| `/roles setup` | Cria painel de cargos | Admin |
| `/roles add` | Adiciona cargo ao painel | Admin |
| `/roles remove` | Remove cargo do painel | Admin |
| `/roles list` | Lista cargos disponíveis | Todos |

---

## Recursos

- Botões ou select menu
- Cargos por categoria
- Logs de alterações
- Limite de cargos por grupo
- Painel editável

---

## Banco de dados

```txt
guild_configs
role_panels
role_options
role_logs
```

---

## Roadmap

1. Criar comando setup
2. Criar painel de cargos
3. Adicionar botões/select menu
4. Aplicar/remover cargos
5. Criar logs
6. Documentar instalação

---

## Segurança

- Bloquear cargos administrativos
- Validar permissões do bot
- Impedir cargos acima do cargo do bot
- Registrar alterações importantes

---

## Features futuras

- Cargos temporários
- Cargos por nível
- Dashboard web
- Templates de painéis
