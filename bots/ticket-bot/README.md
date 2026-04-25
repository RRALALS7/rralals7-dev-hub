# 🎟️ RRALALS7 Ticket Bot

> Bot de tickets simples, seguro e pronto para Discord.

---

## Status

```txt
✅ Testado e aprovado em ambiente real
```

Este bot já passou por teste prático e foi aprovado para entrar na lista de projetos validados do RRALALS7 Dev Hub.

---

## Recursos

- `/ticket setup`
- `/ticket close`
- Painel com botão
- Canal privado por ticket
- Permissão para usuário + staff
- Fechamento por botão

---

## Instalação

```bash
npm install
cp .env.example .env
npm run register
npm start
```

---

## Variáveis

```env
DISCORD_TOKEN=token_do_bot
CLIENT_ID=id_do_bot
GUILD_ID=id_do_servidor_opcional
STAFF_ROLE_ID=id_do_cargo_staff_opcional
```

---

## Permissões recomendadas

- Manage Channels
- View Channels
- Send Messages
- Read Message History
- Use Slash Commands

---

## Segurança

- Teste antes em servidor privado
- Não publique seu `.env`
- Deixe o cargo do bot acima dos cargos que ele precisa gerenciar

---

## Próximos upgrades possíveis

- transcript de tickets
- logs de abertura/fechamento
- motivo de fechamento
- avaliação de atendimento
- categorias diferentes por tipo de suporte

> RRALALS7 sempre ajuda.
