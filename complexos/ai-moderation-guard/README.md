# 🛡️ Moderation OS — AI Moderation Guard

> Sistema avançado de moderação inspirado em bots profissionais, com IA opcional, contexto, score, confiança e arquitetura modular.

---

## Evolução do sistema

O AI Moderation Guard evoluiu para um sistema estilo Moderation OS.

Agora inclui:

- AI Message Guard
- Mention/Reply Moderation
- Detecção de conteúdo inapropriado
- Score + confiança
- Contexto recente
- Modos configuráveis
- Logs detalhados
- Base para dashboard

---

## Novos módulos

### 🧠 AI Message Guard

Analisa mensagens com:

- heurísticas locais
- IA opcional (Groq)
- score de risco
- confiança

---

### 🔔 Mention / Reply Moderation

Detecta:

- spam de menção
- assédio via reply
- flood direcionado

Ações:

- log
- aviso
- bloqueio leve

---

### ⚠️ Detecção de conteúdo inapropriado

Detecta:

- linguagem ofensiva
- conteúdo sensível
- spam
- comportamento suspeito

Sempre com:

```txt
score + confiança + contexto
```

---

## Score

| Score | Ação |
|---|---|
| 0-20 | ignorar |
| 21-40 | log |
| 41-60 | aviso |
| 61-80 | revisão |
| 81-100 | ação forte (se permitido) |

---

## Confiança

Regra central:

```txt
score alto + confiança baixa = não punir pesado
```

---

## Modos

- manual
- safe
- balanced
- strict

---

## Arquitetura

```txt
ai-moderation-guard/
├── core/
│   ├── score-engine.js
│   ├── confidence-engine.js
│   └── context-engine.js
├── modules/
│   ├── message-guard.js
│   ├── mention-guard.js
│   ├── reply-guard.js
│   ├── content-filter.js
│   ├── staff-assistant.js
│   ├── appeal-system.js
│   └── reputation-system.js
```

---

## Futuro

- dashboard web
- painel de revisão
- histórico por usuário
- alertas em tempo real
- integração com banco de dados

> RRALALS7 sempre ajuda.
