# 🚀 RRALALS7 Dev Hub

> **RRALALS7 sempre ajuda.**

Central pública de **bots prontos, sistemas complexos, automações, ferramentas gamer, utilitários Roblox, IA aplicada, apps web e documentação para devs**.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Made by RRALALS7](https://img.shields.io/badge/made%20by-RRALALS7-purple)
![Language](https://img.shields.io/badge/language-PT--BR-blue)
![Focus](https://img.shields.io/badge/focus-bots%20%2B%20systems-orange)

---

## ✅ Ponto fixo atual

O hub chegou em um ponto estável:

```txt
bots simples → feitos, testados e aprovados
bugs reais encontrados → corrigidos ou isolados
complexos principais → validados quando testados
CI → ajustado para não quebrar com pacote problemático
MDs → organizados com instalação, uso e observações
```

Este repositório agora pode ser tratado como um **portfólio funcional**, não apenas como uma lista de ideias.

---

## ✨ Objetivo

Entregar projetos reais, organizados em níveis:

- bots simples para rodar rápido
- bots complexos com módulos e arquitetura
- sistemas de verificação, moderação e comunidade
- apps web e ferramentas auxiliares
- templates e documentação para criar novos projetos
- site/vitrine do Dev Hub

---

## 🧭 Estrutura principal

| Área | Caminho | Descrição |
|---|---|---|
| 🤖 Bots prontos | [`bots/`](./bots) | Bots simples em Node.js/Python para estudar, adaptar e rodar |
| 🧬 Bots complexos | [`complexos/`](./complexos) | Sistemas avançados com módulos, logs, IA opcional e configuração |
| 🌐 Apps web | [`apps/`](./apps) | Ferramentas e starters web |
| 🧠 Arquitetura | [`architecture/`](./architecture) | Explicações técnicas dos sistemas |
| 🧪 Casos de teste | [`test-cases/`](./test-cases) | Testes, edge cases e prevenção de falso positivo |
| 🧰 Templates | [`templates/`](./templates) | Modelos de roadmap, ideia e documentação |
| 📚 Docs | [`docs/`](./docs) | Guias gerais do projeto |
| 🌐 Site | [`site/`](./site) | Vitrine web do Dev Hub |
| 📌 Status | [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) | Painel geral do estado dos projetos |
| 🗺️ Roadmap | [`ROADMAP.md`](./ROADMAP.md) | Prioridades e direção do projeto |

---

## 🤖 Bots simples validados

| Bot | Status | Observação |
|---|---|---|
| RRALALS7 Bot Suite | ✅ Testado | suíte geral aprovada |
| Ticket Bot | ✅ Testado | suporte por tickets |
| Auto Roles Bot | ✅ Testado | painel de cargos |
| Giveaway Bot | ✅ Testado | sorteios por botão |
| Poll Bot | ✅ Testado | enquetes rápidas |
| Economy Bot | ✅ Testado | loja/inventário corrigidos |
| Anti Scam Bot | ✅ Testado | verificação defensiva de links |
| Roblox Public Info Bot | ✅ Testado | dados públicos Roblox |
| Roblox Verify Bot | ✅ Testado | verificação por perfil público |
| Study Helper Bot | ✅ Testado | flashcards e quiz |
| Minecraft Status Bot Python | ✅ Testado | suporte atual: Java Edition |
| Game Tournament Bot | ✅ Testado | torneios e chaveamento simples |

Veja tudo em [`bots/`](./bots).

---

## 🧬 Sistemas complexos

| Sistema | Status | Observação |
|---|---|---|
| Community Master Bot | ✅ Testado | primeiro complexo aprovado |
| Roblox Rigid Verification | ✅ Testado | bug de registro corrigido |
| Moderation OS / AI Guard | 🛠️ Corrigido | exige reteste final cuidadoso |
| Music Station Bot | 🧪 Experimental | código mantido; `package.json` removido para não quebrar CI |

Veja tudo em [`complexos/`](./complexos).

---

## 🚀 Como usar qualquer bot Node.js

1. Abra a pasta do bot.
2. Copie `.env.example` para `.env`.
3. Preencha `DISCORD_TOKEN`, `CLIENT_ID` e, se quiser registrar rápido em servidor privado, `GUILD_ID`.
4. Rode:

```bash
npm install
npm run register
npm start
```

5. Teste os comandos em um servidor privado.

---

## 🐍 Como usar bot Python

```bash
pip install -r requirements.txt
cp .env.example .env
python src/main.py
```

---

## ✅ Checks rápidos

O repo possui GitHub Actions para checar:

- instalação dos projetos Node.js
- sintaxe JavaScript
- compilação Python

O bot de música avançado foi isolado do CI removendo o `package.json`, porque dependências de áudio/voz podem quebrar o pipeline. O código segue preservado para refatoração futura.

---

## 🛡️ Regras do Hub

Este projeto **não apoia** e **não publica** conteúdo para:

- roubo de contas
- token grabber
- phishing
- spam, raid ou flood
- selfbot abusivo
- bypass de ban
- coleta de dados privados
- automação maliciosa
- exploração de plataformas ou usuários

O foco é: **aprender, criar, proteger, automatizar com responsabilidade e ajudar a comunidade.**

---

## 📌 Status completo

Para ver o estado geral de cada bot, sistema, app e documentação, abra:

[`PROJECT_STATUS.md`](./PROJECT_STATUS.md)

---

## 🧩 Próximos passos

- adicionar prints/GIFs dos bots aprovados
- criar releases por bot
- criar versões SQLite para bots com dados persistentes
- refatorar o Music Station Bot do zero quando for voltar nele
- evoluir o site/vitrine
- manter CI verde

---

## ❤️ Criado por

**RRALALS7**

> Criatividade, código e ajuda pra comunidade dev.
