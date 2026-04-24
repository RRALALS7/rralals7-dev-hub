# 🧩 Módulos do AI Moderation Guard

> O AI Moderation Guard não deve ser só um bot que detecta mensagem ruim. Ele deve ser um sistema completo de segurança, staff e comunidade.

---

## Visão geral

O projeto evolui para um conjunto de módulos:

| Módulo | Objetivo |
|---|---|
| Server Guardian | proteger o servidor contra raid, flood e emergências |
| Staff Assistant | ajudar a staff a analisar casos sem agir injustamente |
| Appeal System | permitir revisão organizada de punições |
| Reputation System | medir confiança comunitária com proteção contra abuso |
| AI Message Guard | analisar mensagens com score, confiança e contexto |

---

# 1. 🛡️ Server Guardian

Sistema de proteção do servidor.

## Recursos

- detectar flood
- detectar entrada massiva de contas
- modo pânico
- travar canais temporariamente
- registrar ações em logs
- alertar staff
- proteger canais importantes

## Comandos planejados

```txt
/guardian status
/guardian panic on
/guardian panic off
/guardian lockdown channel
/guardian unlock channel
/guardian config
```

## Regras

- modo pânico deve ser ativado por staff
- ações fortes precisam de log
- nada de punição em massa sem confirmação

---

# 2. 🧠 Staff Assistant

Assistente para ajudar moderadores.

## Recursos

- resumir caso de denúncia
- analisar histórico recente de usuário
- sugerir ação proporcional
- listar evidências
- gerar relatório para staff
- apontar incerteza

## Comandos planejados

```txt
/staff analyze user:@membro
/staff report user:@membro
/staff summarize channel:#canal
/staff suggest case_id:123
```

## Regra principal

O Staff Assistant não pune sozinho. Ele recomenda e explica.

---

# 3. ⚖️ Appeal System

Sistema de recurso para punições.

## Recursos

- abrir recurso
- status: pendente, aceito, negado
- histórico de decisões
- resposta da staff
- revisão organizada
- logs privados

## Comandos planejados

```txt
/appeal open
/appeal status
/appeal review
/appeal close
```

## Objetivo

Evitar injustiça e dar organização para servidores grandes.

---

# 4. ⭐ Reputation System

Sistema de reputação comunitária.

## Recursos

- reputação positiva
- feedback controlado
- ranking de confiança
- proteção contra spam de votos
- logs de reputação
- reputação privada ou pública por configuração

## Comandos planejados

```txt
/rep give user:@membro motivo:ajudou
/rep profile user:@membro
/rep leaderboard
/rep config
```

## Cuidados

- impedir abuso de votos
- limitar votos por tempo
- permitir staff resetar reputação fraudulenta

---

# 5. 🤖 AI Message Guard

Módulo de análise de mensagens.

## Recursos

- score de gravidade
- confidence de certeza
- contexto recente
- modo safe, manual, balanced e strict
- logs detalhados
- ação progressiva

## Regra de ouro

```txt
score alto + confiança baixa = não punir pesado
```

---

## Estrutura ideal futura

```txt
ai-moderation-guard/
├── src/
│   ├── index.js
│   ├── modules/
│   │   ├── ai-message-guard.js
│   │   ├── server-guardian.js
│   │   ├── staff-assistant.js
│   │   ├── appeal-system.js
│   │   └── reputation-system.js
│   ├── core/
│   │   ├── config.js
│   │   ├── database.js
│   │   ├── logger.js
│   │   └── permissions.js
│   └── commands/
└── README.md
```

---

## Conclusão

O AI Moderation Guard deve virar um sistema completo de proteção, revisão, reputação e apoio à staff.

> RRALALS7 sempre ajuda.
