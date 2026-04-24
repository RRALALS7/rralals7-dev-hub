# 🛡️ Anti-Scam Link Checker Bot — Plano Oficial

> Bot defensivo para verificar links suspeitos em comunidades.

---

## Objetivo

Criar um bot que ajuda servidores a detectar links suspeitos, alertando usuários e staff com responsabilidade.

---

## Stack

- Node.js
- discord.js
- APIs de reputação de links
- SQLite
- Express opcional para dashboard

---

## Comandos

| Comando | Função | Permissão |
|---|---|---|
| `/checklink` | Verifica um link manualmente | Todos |
| `/antiscam setup` | Configura canal de logs | Admin |
| `/antiscam whitelist` | Permite domínio confiável | Admin |
| `/antiscam blacklist` | Bloqueia domínio perigoso | Admin |
| `/antiscam status` | Mostra configuração | Staff |

---

## Recursos

- Checagem manual de URL
- Detecção de links em mensagens públicas
- Resultado: safe, suspicious, malicious ou unknown
- Canal de logs
- Whitelist e blacklist
- Cooldown por usuário

---

## Banco de dados

```txt
guild_configs
checked_links
domain_whitelist
domain_blacklist
security_logs
```

---

## Roadmap

1. Criar comando `/checklink`
2. Validar URL
3. Integrar API de reputação
4. Criar logs
5. Adicionar whitelist/blacklist
6. Criar modo automático opcional
7. Documentar limites e segurança

---

## Segurança

- Não acusar domínio sem evidência
- Mostrar risco como indicação, não sentença absoluta
- Não abrir links suspeitos no bot
- Respeitar privacidade da comunidade
- Evitar punição automática sem configuração clara

---

## Features futuras

- Dashboard de domínios
- Relatórios semanais
- Exportação de logs
- Integração com WHOIS Helper
