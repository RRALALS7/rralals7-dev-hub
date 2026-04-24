# 🛡️ AI Moderation Guard

> Sistema avançado de moderação com score, confiança, contexto e IA opcional via Groq.

---

## Ideia principal

O bot não pune por uma mensagem solta sem contexto.

Ele usa:

- filtro local
- contexto recente
- score
- confiança
- modo configurável
- logs
- ação progressiva

---

## Score

| Score | Significado | Ação padrão safe |
|---|---|---|
| 0-20 | seguro | nada |
| 21-40 | suspeito | log silencioso |
| 41-60 | risco médio | log + aviso leve |
| 61-80 | alto risco | revisão/log |
| 81-100 | crítico | revisão urgente |

---

## Confiança

Se a confiança for baixa, o bot reduz a ação.

Regra de ouro:

```txt
score alto + confiança baixa = não punir pesado
```

---

## Modos

- `manual`: só recomenda para staff
- `safe`: logs e avisos leves
- `balanced`: ações moderadas
- `strict`: ações fortes somente se configurado

Padrão: `safe`

---

## Instalação

```bash
npm install
cp .env.example .env
npm run register
npm start
```

---

## Segurança

- Não usar como juiz cego
- Sempre manter logs
- Testar em servidor privado
- Preferir revisão humana para casos graves

> Sistema de moderação • RRALALS7
