# 🎮 Minecraft Status Bot — Python

> Bot Discord em **Python** para consultar status de servidores Minecraft.

---

## Recursos

- `/mcstatus` — mostra status do servidor
- `/mcping` — mostra latência aproximada
- `/mcwatch` — salva um servidor favorito por servidor Discord
- `/mcwatch_status` — consulta o servidor salvo
- Suporte a servidores Java Edition
- Mensagens bonitas com embeds

---

## Stack

- Python
- discord.py
- mcstatus
- python-dotenv

---

## Instalação

```bash
pip install -r requirements.txt
cp .env.example .env
python src/main.py
```

---

## Variáveis

```env
DISCORD_TOKEN=token_do_bot
GUILD_ID=opcional_id_do_servidor_para_sincronizar_rapido
```

---

## Como usar

```txt
/mcstatus host:play.hypixel.net
/mcping host:play.hypixel.net
/mcwatch host:play.hypixel.net
/mcwatch_status
```

---

## Segurança e limites

- Use apenas servidores que podem ser consultados publicamente
- Não faça spam de comandos
- Não use para atacar servidores
- O bot apenas consulta status público

> RRALALS7 sempre ajuda.
