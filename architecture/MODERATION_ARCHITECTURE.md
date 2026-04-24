# 🛡️ Arquitetura — AI Moderation Guard

> Moderação avançada precisa ser precisa, contextual e justa.

---

## Fluxo principal

```txt
Mensagem nova
↓
Filtro local leve
↓
Coleta de contexto curto
↓
Análise de risco
↓
Score + confiança
↓
Regra configurada
↓
Log, aviso ou ação moderada
```

---

## Score e confiança

| Campo | Função |
|---|---|
| `score` | gravidade do conteúdo |
| `confidence` | certeza da análise |

Uma mensagem com score alto e confiança baixa não deve gerar ação pesada.

---

## Modos

| Modo | Comportamento |
|---|---|
| manual | só recomenda para staff |
| safe | logs e avisos leves |
| balanced | avisos e timeout curto |
| strict | ações mais fortes, se configurado |

Padrão recomendado: `manual` ou `safe`.

---

## Anti falso-positivo

O bot deve reduzir risco quando:

- frase é curta
- parece meme
- contexto é de jogo
- usuário está citando denúncia
- confiança é baixa
- não há repetição

---

## Ação progressiva

1. nada
2. log silencioso
3. aviso
4. timeout curto
5. revisão humana

---

## Assinatura discreta

```txt
Sistema de moderação • RRALALS7
```

---

## Conclusão

Um bom bot de moderação não é o que pune mais. É o que erra menos.
