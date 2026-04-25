# 💰 RRALALS7 Economy Bot

> Bot Discord de economia ficticia para comunidade.

---

## Status

```txt
✅ Testado e aprovado em ambiente real
⚙️ Loja corrigida para mostrar itens e escolhas no /buy
✨ Itens agora possuem efeitos com /use
```

Este bot já passou por teste prático e foi aprovado para entrar na lista de projetos validados do RRALALS7 Dev Hub.

---

## Recursos

- `/balance`
- `/daily`
- `/sendcoins`
- `/shop`
- `/buy`
- `/use`
- `/inventory`
- `/leaderboard`

---

## Itens da loja

| ID | Item | Preço | Consumível | Efeito |
|---|---|---:|---|---|
| `vip` | VIP Fake | 500 | Não | Mostra um cartão VIP estiloso com seu nome |
| `badge` | Badge Gamer | 250 | Não | Exibe uma badge gamer com brilho |
| `crate` | Caixa Misteriosa | 100 | Sim | Abre e dá entre 50 e 300 coins fictícias |

No Discord, o comando `/buy` mostra os itens como escolhas para evitar erro digitando ID.

---

## Como usar os itens

Depois de comprar um item, use:

```txt
/use item:<item>
```

Exemplos:

```txt
/use item:vip
/use item:badge
/use item:crate
```

Itens permanentes, como `vip` e `badge`, não são consumidos.

Itens consumíveis, como `crate`, saem do inventário depois de usados.

---

## Instalacao

```bash
npm install
cp .env.example .env
npm run register
npm start
```

---

## Uso responsavel

- A moeda e ficticia e nao tem valor real
- Nao usar para apostas, venda, troca real ou dinheiro real
- Projeto feito para diversao e aprendizado

---

## Próximos upgrades possíveis

- loja configurável por JSON
- mais itens cosméticos fictícios
- cooldown configurável do daily
- ranking por servidor
- recompensas por evento
- sistema de equipar/remover item cosmético

> RRALALS7 sempre ajuda.
