const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('verify')
  .setDescription('Sistema de verificacao Roblox')
  .addSubcommand(sub => sub
    .setName('start')
    .setDescription('Comeca verificacao')
    .addStringOption(opt => opt.setName('username').setDescription('Username Roblox').setRequired(true)))
  .addSubcommand(sub => sub.setName('check').setDescription('Confere codigo no perfil publico'))
  .addSubcommand(sub => sub.setName('status').setDescription('Mostra status da sua verificacao'));

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
