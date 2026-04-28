# 🧬 Bots Complexos — RRALALS7 Dev Hub

> Sistemas avançados com automação real, módulos, logs, IA opcional e arquitetura mais profissional.

---

## Estado atual

A pasta `complexos/` representa os projetos maiores do hub.

Ponto final deste arco:

```txt
Community Master Bot → testado e aprovado
Roblox Rigid Verification → testado e aprovado
Moderation OS / AI Guard → corrigido, exige reteste cuidadoso
Music Station Bot → bugado/experimental, deve ser removido/refeito
```

---

## Diferença desta pasta

A pasta `bots/` contém bots simples e diretos para estudar e rodar rápido.

A pasta `complexos/` contém projetos maiores, com:

- múltiplos módulos;
- configuração por servidor;
- logs;
- permissões avançadas;
- fluxo automático;
- integração opcional com IA;
- regras de segurança;
- estrutura mais próxima de produção.

---

## Projetos complexos atuais

| Projeto | Pasta | Stack | Status |
|---|---|---|---|
| Community Master Bot | [`community-master-bot`](./community-master-bot) | Node.js modular | ✅ Testado e aprovado |
| Roblox Rigid Verification | [`roblox-rigid-verification`](./roblox-rigid-verification) | Node.js | ✅ Testado e aprovado |
| Moderation OS / AI Moderation Guard | [`ai-moderation-guard`](./ai-moderation-guard) | Node.js + Groq opcional | 🛠️ Corrigido, precisa teste final |
| Music Station Bot | [`music-station-bot`](./music-station-bot) | Node.js + Voice | ❌ Remover/refazer do zero |

---

## ⚠️ Nota importante sobre o Music Station Bot

O **Music Station Bot** não deve ser considerado pronto.

Recomendação final:

```txt
Remover/deletar o Music Station Bot do repo ou tirar da versão principal.
Refazer do zero futuramente, se música voltar a ser prioridade.
```

Motivo:

- dependências de áudio/voz podem quebrar instalação;
- pode atrapalhar CI;
- precisa de refatoração completa;
- manter ele como projeto pronto pode passar impressão errada.

---

## Módulos importantes já planejados/criados

### Moderation OS

- AI Message Guard;
- Mention/Reply moderation planejado;
- detecção de conteúdo inapropriado;
- Staff Assistant;
- Appeal System;
- Reputation System;
- Server Guardian planejado com cuidado extra.

### Community Master Bot

- Core module;
- Utility module;
- Economy module;
- Polls module;
- estrutura modular pronta para tickets, sorteios e moderação leve;
- primeiro complexo validado em ambiente real.

### Roblox Rigid Verification

- cargo Não Verificado;
- cargo Verificado;
- canal de verificação;
- logs de staff;
- validação por perfil público Roblox;
- bug de registro corrigido.

### Music Station Bot

- status atual: instável/experimental;
- não conta como projeto finalizado;
- deve ser removido ou refeito do zero.

---

## Projetos complexos para o futuro

| Projeto | Ideia |
|---|---|
| Server Control Center | painel central para configurar bots |
| Community Security Suite | pacote de segurança defensiva para comunidades |
| Tournament Pro | torneios com times, MD3/MD5 e ranking |
| Roblox Community Manager | verificação, cargos, grupo e eventos Roblox |
| Bot Dashboard | painel web opcional para status e configuração |
| Music Station Bot V2 | bot de música refeito do zero, com arquitetura limpa |

---

## Regra dos bots complexos

Bots complexos precisam ser úteis, seguros e configuráveis.

Obrigatório:

- logs de ações;
- motivo da ação;
- configuração clara;
- modo seguro por padrão;
- permissões revisadas;
- possibilidade de revisão humana;
- ações fortes somente com configuração explícita.

---

## Próximo ponto fixo

Depois do checkpoint final, o foco é:

1. remover o Music Station Bot da versão principal;
2. manter apenas complexos estáveis como destaque;
3. retestar o Moderation OS com cuidado;
4. criar releases para os complexos aprovados;
5. migrar dados persistentes para SQLite quando fizer sentido.

> RRALALS7 sempre ajuda.
