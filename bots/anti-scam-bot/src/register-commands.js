const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('checklink')
  .setDescription('Verifica se um link parece suspeito')
  .addStringOption(opt => opt.setName('url').setDescription('Link para verificar').setRequired(true));

async function main() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  const route = process.env.GUILD_ID ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID) : Routes.applicationCommands(process.env.CLIENT_ID);
  await rest.put(route, { body: [command.toJSON()] });
  console.log('Comandos registrados com sucesso.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
