# 🧪 Casos de Teste — Moderação

> Exemplos para evitar falso positivo.

---

## Não punir automaticamente

| Mensagem | Motivo |
|---|---|
| vou te destruir no x1 | contexto gamer |
| vou te amassar nessa partida | linguagem competitiva |
| isso parece golpe? | usuário denunciando suspeita |
| olha esse exemplo de phishing | contexto educativo, precisa verificar |
| que raiva desse boss | expressão comum de jogo |

---

## Exigir contexto

- mensagens curtas
- ironias
- memes
- prints copiados
- citações de denúncia
- conversa de jogo

---

## Ação recomendada por incerteza

| Situação | Ação |
|---|---|
| score alto + confiança baixa | log silencioso |
| score médio + contexto fraco | revisar |
| score baixo + confiança alta | nada |
| repetição suspeita | aviso ou revisão |

---

## Conclusão

A IA deve ajudar a staff, não virar um juiz cego.
