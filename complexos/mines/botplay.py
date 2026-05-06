import discord
from discord.ext import commands
from discord import app_commands
import random
import json
import os
import time
import threading
from dotenv import load_dotenv

load_dotenv()

# Configurações iniciais
TOKEN = os.getenv("DISCORD_TOKEN2")
OWNER_ID = int(os.getenv("OWNER_ID")) if os.getenv("OWNER_ID") else 0

DB_FILE = "db.json"
TOTAL_SQUARES = 20
MAX_BOMBS = 19
PANEL_IMAGE = "https://cdn.discordapp.com/attachments/794347587016327252/1394132043557769408/images_18.jpg"

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

lock = threading.Lock()

# ---------------- DATABASE ----------------

def load_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w") as f:
            json.dump({
                "users": {},
                "bonus_config": {
                    "valor": 1000,
                    "cooldown": 3600
                },
                "active_drops": {}
            }, f)
    with open(DB_FILE) as f:
        data = json.load(f)
        if "bonus_config" not in data:
            data["bonus_config"] = {"valor": 1000, "cooldown": 3600}
        if "active_drops" not in data:
            data["active_drops"] = {}
        return data

db = load_db()

def save_db():
    with lock:
        with open(DB_FILE, "w") as f:
            json.dump(db, f, indent=4)

def get_user(uid):
    uid = str(uid)
    if uid not in db["users"]:
        db["users"][uid] = {
            "saldo": "0",
            "last_bonus": 0
        }
    return db["users"][uid]

def get_saldo(uid):
    return int(get_user(uid)["saldo"])

def set_saldo(uid, value):
    uid = str(uid)
    get_user(uid)
    db["users"][uid]["saldo"] = str(value)
    save_db()

def add_saldo(uid, amount):
    saldo = get_saldo(uid)
    saldo += amount
    set_saldo(uid, saldo)

def remove_saldo(uid, amount):
    saldo = get_saldo(uid)
    saldo -= amount
    if saldo < 0:
        saldo = 0
    set_saldo(uid, saldo)

# ---------------- LÓGICA DE MULTIPLICADOR ----------------

def calculate_multiplier(bombs, hits):
    if hits == 0: return 1.0
    if bombs == 1: return round(float(2 * hits), 2)
    if bombs >= 2:
        if bombs >= 19: return 12000000.0
        base_multiplier = 5.0 * (bombs ** 1.8)
        growth = hits ** 2.2
        return round(base_multiplier * growth, 2)
    return 1.0

# ---------------- MINES GAME ----------------

class MinesGame(discord.ui.View):
    def __init__(self, bombs, bet, owner):
        super().__init__(timeout=300)
        self.owner = owner
        self.bet = bet
        self.bombs_count = bombs
        self.hits = 0
        self.multiplier = 1.0
        self.game_over = False
        self.bomb_positions = random.sample(range(TOTAL_SQUARES), bombs)
        for i in range(TOTAL_SQUARES):
            self.add_item(MineButton(i))
        self.cashout_button = CashoutButton()
        self.add_item(self.cashout_button)

    async def reveal_all(self, interaction, won=False):
        self.game_over = True
        for item in self.children:
            if isinstance(item, MineButton):
                item.disabled = True
                if item.pos in self.bomb_positions:
                    item.label = "💣"
                    item.style = discord.ButtonStyle.danger
                else:
                    item.label = "💎"
                    item.style = discord.ButtonStyle.success
            if isinstance(item, CashoutButton):
                item.disabled = True
        
        status = "✅ VITÓRIA!" if won else "💥 DERROTA!"
        color = 0x2ECC71 if won else 0xE74C3C
        embed = interaction.message.embeds[0]
        embed.color = color
        embed.title = f"💣 Mines - {status}"
        
        if won:
            profit = int(self.bet * self.multiplier)
            embed.description = f"💰 **Você sacou:** {profit} coins\n📈 **Multiplicador final:** {self.multiplier}x"
        else:
            embed.description = f"❌ **Você explodiu!**\n💸 **Perdeu:** {self.bet} coins"
            
        await interaction.response.edit_message(embed=embed, view=self)

class MineButton(discord.ui.Button):
    def __init__(self, pos):
        super().__init__(label="⬜", style=discord.ButtonStyle.secondary, row=pos // 5, custom_id=f"mine_{pos}")
        self.pos = pos

    async def callback(self, interaction: discord.Interaction):
        game: MinesGame = self.view
        if interaction.user.id != game.owner:
            return await interaction.response.send_message("Este jogo não é seu!", ephemeral=True)
        if game.game_over: return
        if self.pos in game.bomb_positions:
            await game.reveal_all(interaction, won=False)
        else:
            game.hits += 1
            self.label = "💎"
            self.style = discord.ButtonStyle.success
            self.disabled = True
            game.multiplier = calculate_multiplier(game.bombs_count, game.hits)
            game.cashout_button.label = f"💰 Sacar ({game.multiplier}x)"
            if game.hits == (TOTAL_SQUARES - game.bombs_count):
                win_amount = int(game.bet * game.multiplier)
                add_saldo(game.owner, win_amount)
                await game.reveal_all(interaction, won=True)
            else:
                await interaction.response.edit_message(view=game)

class CashoutButton(discord.ui.Button):
    def __init__(self):
        super().__init__(label="💰 Sacar (0.0x)", style=discord.ButtonStyle.primary, row=4, custom_id="cashout")
    async def callback(self, interaction: discord.Interaction):
        game: MinesGame = self.view
        if interaction.user.id != game.owner:
            return await interaction.response.send_message("Este jogo não é seu!", ephemeral=True)
        if game.game_over or game.hits == 0: return
        win_amount = int(game.bet * game.multiplier)
        add_saldo(game.owner, win_amount)
        await game.reveal_all(interaction, won=True)

# ---------------- BÔNUS COLETIVO (CLAIMABLE) ----------------

class CollectiveBonusView(discord.ui.View):
    def __init__(self, drop_id, amount, limit):
        super().__init__(timeout=None)
        self.drop_id = drop_id
        self.amount = amount
        self.limit = limit

    @discord.ui.button(label="🎁 Resgatar Bônus", style=discord.ButtonStyle.green, custom_id="claim_bonus_btn")
    async def claim(self, interaction: discord.Interaction, button: discord.ui.Button):
        if self.drop_id not in db["active_drops"]:
            button.disabled = True
            button.label = "Encerrado"
            return await interaction.response.edit_message(view=self)

        drop = db["active_drops"][self.drop_id]
        user_id = str(interaction.user.id)

        if user_id in drop["claimed_by"]:
            return await interaction.response.send_message("Você já resgatou este bônus!", ephemeral=True)

        if len(drop["claimed_by"]) >= drop["limit"]:
            button.disabled = True
            button.label = "Esgotado"
            await interaction.response.edit_message(view=self)
            return await interaction.followup.send("Este bônus já foi todo resgatado!", ephemeral=True)

        drop["claimed_by"].append(user_id)
        add_saldo(interaction.user.id, drop["amount"])
        save_db()

        remaining = drop["limit"] - len(drop["claimed_by"])
        embed = interaction.message.embeds[0]
        embed.description = f"🎁 **Bônus de {drop['amount']} coins disponível!**\n\nResgates: `{len(drop['claimed_by'])}/{drop['limit']}`\nRestantes: `{remaining}`"
        
        if remaining <= 0:
            button.disabled = True
            button.label = "Esgotado"
            embed.color = 0x99AAB5
            embed.title = "🎁 Bônus Coletivo (Esgotado)"
        
        await interaction.response.edit_message(embed=embed, view=self)
        await interaction.followup.send(f"Você resgatou **{drop['amount']} coins**!", ephemeral=True)

# ---------------- COMANDOS DE OWNER ----------------

@bot.tree.command(name="bonus_configurar", description="[OWNER] Configura o valor e cooldown do bônus individual")
async def bonus_configurar(interaction: discord.Interaction, valor: int, cooldown: int):
    if interaction.user.id != OWNER_ID:
        return await interaction.response.send_message("Apenas o dono do bot pode usar este comando.", ephemeral=True)
    db["bonus_config"]["valor"] = valor
    db["bonus_config"]["cooldown"] = cooldown
    save_db()
    await interaction.response.send_message(f"Bônus configurado: **{valor} coins** | Cooldown: **{cooldown}s**", ephemeral=True)

@bot.tree.command(name="bonus_enviar", description="[OWNER] Envia um bônus coletivo para 20 pessoas resgatarem")
async def bonus_enviar(interaction: discord.Interaction, valor: int = None):
    if interaction.user.id != OWNER_ID:
        return await interaction.response.send_message("Apenas o dono do bot pode usar este comando.", ephemeral=True)
    amount = valor if valor else db["bonus_config"]["valor"]
    limit = 20
    drop_id = str(int(time.time()))
    db["active_drops"][drop_id] = {"amount": amount, "limit": limit, "claimed_by": []}
    save_db()
    embed = discord.Embed(title="🎁 Bônus Coletivo!", description=f"🎁 **Bônus de {amount} coins disponível!**\n\nResgates: `0/{limit}`\nRestantes: `{limit}`", color=0xFFD700)
    embed.set_footer(text="Clique no botão abaixo para resgatar. Apenas 1 vez por pessoa!")
    view = CollectiveBonusView(drop_id, amount, limit)
    await interaction.response.send_message(embed=embed, view=view)

@bot.tree.command(name="saldo_add", description="[OWNER] Adiciona saldo a um usuário específico")
async def saldo_add(interaction: discord.Interaction, usuario: discord.User, valor: int):
    if interaction.user.id != OWNER_ID:
        return await interaction.response.send_message("Apenas o dono do bot pode usar este comando.", ephemeral=True)
    add_saldo(usuario.id, valor)
    await interaction.response.send_message(f"✅ Adicionado **{valor} coins** para {usuario.mention}. Novo saldo: **{get_saldo(usuario.id)}**", ephemeral=True)

@bot.tree.command(name="saldo_remover", description="[OWNER] Remove saldo de um usuário específico")
async def saldo_remover(interaction: discord.Interaction, usuario: discord.User, valor: int):
    if interaction.user.id != OWNER_ID:
        return await interaction.response.send_message("Apenas o dono do bot pode usar este comando.", ephemeral=True)
    remove_saldo(usuario.id, valor)
    await interaction.response.send_message(f"❌ Removido **{valor} coins** de {usuario.mention}. Novo saldo: **{get_saldo(usuario.id)}**", ephemeral=True)

# ---------------- COMANDOS PÚBLICOS ----------------

@bot.tree.command(name="top", description="Mostra o ranking dos 10 jogadores mais ricos")
async def top(interaction: discord.Interaction):
    # Ordena os usuários pelo saldo (convertendo string para int)
    sorted_users = sorted(db["users"].items(), key=lambda x: int(x[1]["saldo"]), reverse=True)[:10]
    
    if not sorted_users:
        return await interaction.response.send_message("Nenhum jogador no ranking ainda!", ephemeral=True)

    embed = discord.Embed(title="🏆 Ranking de Riqueza - Top 10", color=0xFFD700)
    description = ""
    for i, (uid, data) in enumerate(sorted_users, start=1):
        try:
            user = await bot.fetch_user(int(uid))
            name = user.name
        except:
            name = f"Usuário ({uid})"
        
        description += f"**{i}º** {name} — `{data['saldo']} coins`\n"
    
    embed.description = description
    await interaction.response.send_message(embed=embed)

@bot.tree.command(name="painel", description="[OWNER] Envia o painel principal do Mines")
async def painel(interaction: discord.Interaction):
    if interaction.user.id != OWNER_ID:
        return await interaction.response.send_message("Apenas o dono do bot pode usar este comando.", ephemeral=True)
    embed = discord.Embed(title="💣 Mines Casino", description="Clique no botão abaixo para começar a jogar!", color=0x00AAFF)
    embed.set_image(url=PANEL_IMAGE)
    await interaction.response.send_message(embed=embed, view=StartView())

@bot.tree.command(name="saldo", description="Verifica seu saldo atual")
async def saldo(interaction: discord.Interaction):
    s = get_saldo(interaction.user.id)
    await interaction.response.send_message(f"💰 Seu saldo atual é: **{s} coins**", ephemeral=True)

# ---------------- MODAL & VIEWS ----------------

class MinesModal(discord.ui.Modal, title="Configurar Mines"):
    bombs = discord.ui.TextInput(label="Quantidade de Bombas (1-19)", placeholder="Ex: 1, 3, 19...", min_length=1, max_length=2)
    bet = discord.ui.TextInput(label="Valor da Aposta", placeholder="Quanto deseja apostar?", min_length=1)

    async def on_submit(self, interaction: discord.Interaction):
        try:
            bombs_val = int(self.bombs.value)
            bet_val = int(self.bet.value)
        except ValueError:
            return await interaction.response.send_message("Insira números válidos.", ephemeral=True)

        if bombs_val < 1 or bombs_val > MAX_BOMBS:
            return await interaction.response.send_message(f"Bombas entre 1 e {MAX_BOMBS}.", ephemeral=True)

        saldo = get_saldo(interaction.user.id)
        if bet_val <= 0 or bet_val > saldo:
            return await interaction.response.send_message(f"Saldo insuficiente ou aposta inválida!", ephemeral=True)

        remove_saldo(interaction.user.id, bet_val)
        view = MinesGame(bombs_val, bet_val, interaction.user.id)
        embed = discord.Embed(title="💣 Mines - Jogo Iniciado", description=f"💰 **Aposta:** {bet_val}\n💣 **Bombas:** {bombs_val}", color=0x00AAFF)
        embed.set_image(url=PANEL_IMAGE)
        await interaction.response.send_message(embed=embed, view=view, ephemeral=True)

class StartView(discord.ui.View):
    def __init__(self): super().__init__(timeout=None)
    @discord.ui.button(label="▶️ Jogar Mines", style=discord.ButtonStyle.green, custom_id="start_mines_btn")
    async def start(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.send_modal(MinesModal())

@bot.event
async def on_ready():
    bot.add_view(StartView())
    # Sincroniza os comandos globalmente toda vez que o bot inicia
    # Nota: Comandos globais podem levar até 1 hora para aparecer em todos os servidores
    # Se quiser testar imediato em um servidor específico, use bot.tree.sync(guild=discord.Object(id=ID_DO_SERVER))
    try:
        synced = await bot.tree.sync()
        print(f"Sincronizados {len(synced)} comandos slash.")
    except Exception as e:
        print(f"Erro ao sincronizar comandos: {e}")
    
    print(f"Bot online como {bot.user}")

if __name__ == "__main__":
    if TOKEN: bot.run(TOKEN)
    else: print("Token não encontrado!")