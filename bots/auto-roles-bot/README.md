# 🔐 RRALALS7 Auto Roles Bot

> Bot de auto-cargos com painel de seleção por menu.

---

## Status

```txt
✅ Testado e aprovado em ambiente real
```

Este bot já passou por teste prático e foi aprovado para entrar na lista de projetos validados do RRALALS7 Dev Hub.

---

## Recursos

- `/roles setup`
- Painel com até 10 cargos
- Usuário escolhe/remover cargos pelo menu
- Sem banco de dados obrigatório
- Fácil de adaptar

---

## Instalação

```bash
npm install
cp .env.example .env
npm run register
npm start
```

---

## Uso

```txt
/roles setup cargo1:@Cargo cargo2:@Cargo cargo3:@Cargo
```

O bot cria um painel com menu para os membros escolherem cargos.

---

## Permissões recomendadas

- Manage Roles
- Send Messages
- Use Slash Commands

---

## Segurança

- O cargo do bot precisa estar acima dos cargos que ele vai entregar
- Não coloque cargos administrativos no painel
- Teste antes em servidor privado

---

## Próximos upgrades possíveis

- logs de cargos adicionados/removidos
- limite de escolhas por categoria
- categorias de cargos por tema
- painel com botões além de menu
- modo cargo único por grupo

> RRALALS7 sempre ajuda.
