const dotenv = require('dotenv');
dotenv.config();

const { Client, Collection, GatewayIntentBits } = require('discord.js');

const modules = [
  require('./modules/core'),
  require('./modules/utility'),
  require('./modules/economy'),
  require('./modules/polls')
];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const moduleCommands of modules) {
  for (const command of moduleCommands) {
    client.commands.set(command.data.name, command);
  }
}

client.once('ready', () => {
  console.log(`Community Master online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Erro ao executar comando.', ephemeral: true }).catch(() => null);
    }
  }
});

client.login(process.env.DISCORD_TOKEN || process.env.BOT_TOKEN);
