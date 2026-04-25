# 🧱 Roblox Rigid Verification

> Sistema rígido de verificação Roblox para Discord.

---

## Status

```txt
✅ Testado e aprovado em ambiente real
🛠️ Bug de registro de comandos corrigido
```

O registro de comandos foi corrigido removendo permissões inválidas em subcomandos. A proteção continua sendo feita em runtime no handler.

---

## O que ele faz

Quando alguém entra no servidor:

1. recebe cargo `Não Verificado`
2. só deve ter acesso ao canal de verificação
3. usa `/verify start username:SeuUsuario`
4. recebe um código único
5. coloca o código na descrição pública do perfil Roblox
6. usa `/verify check`
7. recebe `Verificado` e perde `Não Verificado`

---

## Recursos

- cria cargos se não existirem
- cria canal de verificação se não existir
- cria canal de logs se não existir
- aplica cargo Não Verificado automaticamente
- verifica usando descrição pública do Roblox
- adiciona cargo Verificado
- remove cargo Não Verificado
- logs para staff
- comando de setup automático

---

## Instalação

```bash
npm install
cp .env.example .env
npm run register
npm start
```

---

## Comandos

| Comando | Função |
|---|---|
| `/verify setup` | cria cargos/canais e painel |
| `/verify start` | inicia verificação Roblox |
| `/verify check` | confere código no perfil público |
| `/verify status` | mostra status |
| `/verify reset` | staff reseta usuário |

---

## Permissões em runtime

| Comando | Permissão exigida |
|---|---|
| `/verify setup` | Administrator |
| `/verify reset` | Manage Guild |
| `/verify start` | público |
| `/verify check` | público |
| `/verify status` | público |

---

## Segurança

- Nunca pede senha
- Nunca pede token
- Nunca pede cookie
- Usa somente dados públicos
- Deve ser testado em servidor privado antes

---

## Configuração de permissões

O cargo do bot precisa estar acima dos cargos:

- Verificado
- Não Verificado

Permissões recomendadas:

- Manage Roles
- Manage Channels
- Send Messages
- View Channels
- Use Slash Commands

> RRALALS7 sempre ajuda.
