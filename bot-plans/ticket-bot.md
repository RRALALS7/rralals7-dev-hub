# 🎟️ Ticket Bot — Plano Oficial

> Bot de suporte com tickets privados, transcripts e painel de configuração.

---

## Objetivo

Criar um bot de tickets profissional para servidores Discord, permitindo suporte organizado entre membros e staff.

---

## Stack

- Node.js
- discord.js
- SQLite
- dotenv
- opcional: Express para dashboard futuro

---

## Comandos

| Comando | Função | Permissão |
|---|---|---|
| `/ticket setup` | Cria painel de tickets | Admin |
| `/ticket close` | Fecha ticket atual | Staff |
| `/ticket add` | Adiciona usuário ao ticket | Staff |
| `/ticket remove` | Remove usuário do ticket | Staff |
| `/ticket transcript` | Gera histórico | Staff |

---

## Eventos

- Clique no botão de abrir ticket
- Criação de canal privado
- Fechamento de ticket
- Geração de transcript
- Log no canal da staff

---

## Banco de dados

Tabelas sugeridas:

```txt
guild_configs
tickets
ticket_members
transcripts
logs
```

---

## Embeds

### Painel de Ticket

- Título: Suporte
- Descrição: Clique no botão para abrir um ticket
- Botão: Abrir Ticket

### Ticket Aberto

- Título: Ticket criado
- Descrição: Explique seu problema com detalhes
- Botões: Fechar, Transcript

---

## Estrutura de pastas

```txt
ticket-bot/
├── src/
│   ├── commands/
│   ├── events/
│   ├── database/
│   ├── utils/
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

---

## Roadmap

1. Criar base do bot
2. Criar comando setup
3. Criar botão de abrir ticket
4. Criar canal privado
5. Criar fechamento
6. Criar transcript
7. Criar logs
8. Documentar tudo

---

## Segurança

- Apenas admins configuram painel
- Staff fecha tickets
- Não salvar dados sensíveis desnecessários
- Criar logs claros
- Evitar múltiplos tickets duplicados por usuário

---

## Features futuras

- Dashboard web
- Categorias de ticket
- Avaliação de atendimento
- Sistema de prioridade
- Exportação HTML do transcript
