# 🧱 Roblox Public Lookup Bot — Plano Oficial

> Bot para consultar informações públicas de perfis Roblox.

---

## Objetivo

Criar um bot Discord que busca dados públicos de contas Roblox, sem pedir senha, cookie, token ou qualquer dado privado.

---

## Stack

- Node.js
- discord.js
- APIs públicas Roblox
- SQLite para cache opcional

---

## Comandos

| Comando | Função | Permissão |
|---|---|---|
| `/roblox user` | Busca perfil público | Todos |
| `/roblox avatar` | Mostra avatar do usuário | Todos |
| `/roblox id` | Converte username para ID | Todos |
| `/roblox help` | Mostra ajuda | Todos |

---

## Recursos

- Busca por username
- Exibição de avatar
- User ID
- Link do perfil
- Cache de consultas
- Tratamento de erro para usuário inexistente

---

## Banco de dados

```txt
lookup_cache
lookup_logs
guild_configs
```

---

## Roadmap

1. Criar comando `/roblox user`
2. Consultar API pública
3. Montar embed bonito
4. Criar tratamento de erro
5. Adicionar cache
6. Documentar limites

---

## Segurança

- Nunca pedir senha
- Nunca pedir cookie
- Nunca pedir token
- Usar somente dados públicos
- Respeitar rate limits

---

## Features futuras

- Sistema de verificação
- Dashboard de perfis públicos
- Histórico local do servidor
- Favoritos
