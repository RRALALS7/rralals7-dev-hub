const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes } = require('discord.js');

const modules = [
  require('./modules/core'),
  require('./modules/utility'),
  require('./modules/economy'),
  require('./modules/polls')
];

const commands = modules.flat().map(command => command.data.toJSON());
const token = process.env.DISCORD_TOKEN || process.env.BOT_TOKEN;

async function main() {
  const rest = new REST({ version: '10' }).setToken(token);
  const route = process.env.GUILD_ID
    ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
    : Routes.applicationCommands(process.env.CLIENT_ID);

  await rest.put(route, { body: commands });
  console.log('Comandos registrados com sucesso.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
