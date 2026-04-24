import json
import os
from pathlib import Path

import discord
from discord import app_commands
from dotenv import load_dotenv
from mcstatus import JavaServer

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")
GUILD_ID = os.getenv("GUILD_ID")
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_FILE = DATA_DIR / "watchlist.json"

intents = discord.Intents.default()
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)


def load_watchlist() -> dict:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text("{}", encoding="utf-8")
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def save_watchlist(data: dict) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def make_embed(title: str, description: str, color: int = 0x7C3AED) -> discord.Embed:
    embed = discord.Embed(title=title, description=description, color=color)
    embed.set_footer(text="RRALALS7 sempre ajuda.")
    return embed


async def query_server(host: str) -> dict:
    server = JavaServer.lookup(host)
    status = await server.async_status()
    return {
        "host": host,
        "online": status.players.online,
        "max": status.players.max,
        "latency": round(status.latency, 2),
        "version": status.version.name,
        "motd": str(status.description)
    }


@client.event
async def on_ready():
    if GUILD_ID:
        guild = discord.Object(id=int(GUILD_ID))
        tree.copy_global_to(guild=guild)
        await tree.sync(guild=guild)
        print(f"Comandos sincronizados no servidor {GUILD_ID}.")
    else:
        await tree.sync()
        print("Comandos globais sincronizados.")
    print(f"Minecraft Status Bot online como {client.user}.")


@tree.command(name="mcstatus", description="Mostra o status público de um servidor Minecraft Java.")
@app_commands.describe(host="Endereço do servidor, exemplo: play.exemplo.net")
async def mcstatus(interaction: discord.Interaction, host: str):
    await interaction.response.defer()
    try:
        data = await query_server(host)
        description = (
            f"**Servidor:** `{data['host']}`\n"
            f"**Jogadores:** `{data['online']}/{data['max']}`\n"
            f"**Ping:** `{data['latency']}ms`\n"
            f"**Versão:** `{data['version']}`\n"
            f"**MOTD:** {data['motd']}"
        )
        await interaction.followup.send(embed=make_embed("🎮 Minecraft Server Status", description))
    except Exception as error:
        await interaction.followup.send(
            embed=make_embed("❌ Erro ao consultar servidor", f"Não consegui consultar `{host}`.\nDetalhe: `{error}`", 0xEF4444),
            ephemeral=True
        )


@tree.command(name="mcping", description="Mostra a latência aproximada de um servidor Minecraft Java.")
@app_commands.describe(host="Endereço do servidor")
async def mcping(interaction: discord.Interaction, host: str):
    await interaction.response.defer(ephemeral=True)
    try:
        data = await query_server(host)
        await interaction.followup.send(embed=make_embed("🏓 Minecraft Ping", f"`{host}` respondeu em `{data['latency']}ms`."), ephemeral=True)
    except Exception as error:
        await interaction.followup.send(embed=make_embed("❌ Erro", f"Não consegui consultar `{host}`.\n`{error}`", 0xEF4444), ephemeral=True)


@tree.command(name="mcwatch", description="Salva um servidor Minecraft favorito para este Discord.")
@app_commands.describe(host="Endereço do servidor")
async def mcwatch(interaction: discord.Interaction, host: str):
    if not interaction.guild_id:
        return await interaction.response.send_message("Use este comando dentro de um servidor.", ephemeral=True)

    data = load_watchlist()
    data[str(interaction.guild_id)] = host
    save_watchlist(data)
    await interaction.response.send_message(embed=make_embed("✅ Servidor salvo", f"Servidor favorito definido como `{host}`."), ephemeral=True)


@tree.command(name="mcwatch_status", description="Consulta o servidor Minecraft salvo neste Discord.")
async def mcwatch_status(interaction: discord.Interaction):
    if not interaction.guild_id:
        return await interaction.response.send_message("Use este comando dentro de um servidor.", ephemeral=True)

    data = load_watchlist()
    host = data.get(str(interaction.guild_id))
    if not host:
        return await interaction.response.send_message("Nenhum servidor salvo. Use `/mcwatch` primeiro.", ephemeral=True)

    await mcstatus.callback(interaction, host)


if not TOKEN:
    raise RuntimeError("Configure DISCORD_TOKEN no arquivo .env")

client.run(TOKEN)
