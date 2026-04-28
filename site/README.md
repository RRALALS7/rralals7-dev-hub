# 🌐 Site — RRALALS7 Dev Hub

> Vitrine web oficial do RRALALS7 Dev Hub.

---

## Status

```txt
✅ Funcional
✅ Explicado
✅ Atualizado para o checkpoint final
```

O site representa o estado atual do hub:

```txt
feito → testado → corrigido → documentado → checkpoint registrado
```

---

## Objetivo

A pasta `site/` apresenta o projeto de forma visual e direta, mostrando bots, sistemas complexos, apps web e documentação.

Ela funciona como cartão de visita do repositório.

Como o projeto não depende de fotos/prints no momento, a vitrine deve valorizar:

- textos claros;
- status por projeto;
- exemplos de comandos;
- links para documentação;
- cards organizados;
- releases e changelogs futuros.

---

## O que o site mostra

- resumo do hub;
- bots simples testados e aprovados;
- sistemas complexos aprovados/corrigidos;
- alerta de que o Music Station Bot deve ser removido/refeito;
- contador de bots, sistemas complexos e apps;
- ponto fixo atual do projeto;
- catálogo pesquisável;
- filtro por categoria;
- cards com links para READMEs;
- seção de sistemas complexos;
- seção de apps web;
- seção de documentação;
- próximo arco do projeto.

---

## Arquivos

```txt
site/
├── index.html   # estrutura principal da página
├── style.css    # visual, layout, cards e responsividade
├── script.js    # catálogo, busca e filtro por categoria
└── README.md    # documentação do site
```

---

## Como abrir localmente

### Opção 1 — abrir direto

Abra o arquivo abaixo no navegador:

```txt
site/index.html
```

### Opção 2 — servidor local com Python

Na raiz do repositório, rode:

```bash
python -m http.server 3000 -d site
```

Depois abra:

```txt
http://localhost:3000
```

---

## Como editar o conteúdo

### Alterar textos fixos

Edite:

```txt
site/index.html
```

Use esse arquivo para alterar:

- hero;
- estatísticas;
- seção de complexos;
- seção de apps;
- seção de docs;
- seção de futuro.

### Alterar projetos/cards

Edite:

```txt
site/script.js
```

Cada projeto segue este formato:

```js
{
  title: 'Nome do Projeto',
  description: 'Descrição curta.',
  tag: 'Categoria ou status',
  category: 'bot',
  url: '../caminho/README.md'
}
```

Categorias aceitas no filtro:

```txt
bot
complexo
app
doc
```

### Alterar visual

Edite:

```txt
site/style.css
```

Use esse arquivo para alterar:

- cores;
- cards;
- responsividade;
- botões;
- grid;
- espaçamento;
- fundo.

---

## Projetos destacados

### Bots testados

- Ticket Bot
- Auto Roles Bot
- Giveaway Bot
- Poll Bot
- Economy Bot
- Anti Scam Bot
- Roblox Public Info Bot
- Roblox Verify Bot
- Study Helper Bot
- Minecraft Status Bot Python
- Game Tournament Bot
- RRALALS7 Bot Suite

### Complexos

- Community Master Bot — aprovado
- Roblox Rigid Verification — aprovado
- Moderation OS — corrigido, aguardando reteste cuidadoso
- Music Station Bot — remover/refazer do zero

### Apps

- Dev Toolbox Web
- Prompt Library
- Bot Status Dashboard
- Script Catalog

### Docs

- Project Status
- Roadmap Oficial
- Checkpoint Final
- Final Review
- Architecture

---

## Deploy simples

O site é estático. Pode ser publicado em:

- GitHub Pages
- Replit
- Netlify
- Vercel
- qualquer host estático

Para GitHub Pages, normalmente basta configurar Pages para servir a pasta:

```txt
site/
```

ou mover/publicar o conteúdo dela conforme o método escolhido.

---

## Próximos upgrades possíveis

- transformar em React/Vite;
- gerar catálogo por JSON;
- criar página individual para cada bot;
- adicionar exemplos textuais de comandos;
- criar deploy fixo em GitHub Pages, Replit ou outro host;
- adicionar badges de status por projeto;
- criar busca por stack/status;
- esconder/remover Music Station Bot da vitrine principal até ser refeito.

> RRALALS7 sempre ajuda.
