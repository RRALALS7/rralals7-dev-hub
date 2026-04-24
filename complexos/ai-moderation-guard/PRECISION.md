# 🎯 Precisão do AI Moderation Guard

> Objetivo: evitar falso positivo e nunca tomar decisão pesada com base em uma mensagem isolada sem contexto.

---

## Princípio principal

O bot não deve tratar uma mensagem solta como prova absoluta.

A decisão precisa considerar:

- mensagem atual
- mensagens anteriores do mesmo usuário
- canal onde aconteceu
- histórico recente
- cargo do usuário
- severidade
- confiança da IA
- regras configuradas pelo servidor

---

## Fluxo recomendado

```txt
Mensagem nova
↓
Filtro local leve
↓
Coleta de contexto curto
↓
Análise por IA
↓
Score + confiança
↓
Regra do servidor
↓
Log ou ação moderada
```

---

## Score separado de confiança

O bot deve usar dois valores:

| Campo | Função |
|---|---|
| `score` | mede a gravidade do conteúdo |
| `confidence` | mede a certeza da análise |

Exemplo:

```json
{
  "score": 68,
  "confidence": 42,
  "category": "possible_rule_break",
  "reason": "pode depender de contexto"
}
```

Neste caso, mesmo com score médio/alto, a confiança é baixa. Então o bot deve registrar log, não agir pesado.

---

## Regras anti-falso-positivo

### 1. Nunca ação pesada por baixa confiança

Se `confidence < 75`, o bot deve preferir log ou revisão humana.

### 2. Mensagem curta não decide sozinha

Mensagens muito curtas, memes, ironias ou frases soltas devem exigir contexto.

### 3. Histórico importa

Se o usuário tem várias mensagens suspeitas em pouco tempo, o score pode subir.

Se foi uma frase isolada, o score final deve cair.

### 4. Ações progressivas

O bot deve seguir uma escada:

1. nada
2. log silencioso
3. aviso
4. timeout curto
5. revisão por staff

### 5. Modo seguro por padrão

Por padrão, o bot só registra e avisa. Ações mais fortes precisam ser ativadas pelo admin.

---

## Score final

O score final não deve ser só o score da IA.

```txt
score_final = score_ia + fator_historico + fator_repeticao - fator_baixa_confianca - fator_contexto_fraco
```

---

## Exemplo de decisão

| Score | Confiança | Contexto | Resultado |
|---|---|---|---|
| 80 | 35 | fraco | log silencioso |
| 80 | 90 | forte | ação moderada |
| 45 | 85 | forte | aviso leve |
| 20 | 90 | normal | nada |

---

## Marca discreta

Mensagens públicas podem usar uma assinatura pequena:

```txt
Sistema de moderação • RRALALS7
```

Sem exagero, sem poluir o servidor.

---

## Conclusão

Um bot de moderação bom não é o que age rápido em tudo. É o que erra pouco, explica bem e protege o servidor sem ser injusto.

> RRALALS7 sempre ajuda.
