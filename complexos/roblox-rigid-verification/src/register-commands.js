const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('verify')
  .setDescription('Sistema rígido de verificação Roblox')
  .addSubcommand(sub => sub
    .setName('setup')
    .setDescription('Cria cargos, canais e painel de verificação (admin)'))
  .addSubcommand(sub => sub
    .setName('start')
    .setDescription('Inicia verificação por Roblox')
    .addStringOption(opt => opt.setName('username').setDescription('Username Roblox').setRequired(true)))
  .addSubcommand(sub => sub
    .setName('check')
    .setDescription('Confere o código no perfil público Roblox'))
  .addSubcommand(sub => sub
    .setName('status')
    .setDescription('Mostra seu status de verificação'))
  .addSubcommand(sub => sub
    .setName('reset')
    .setDescription('Reseta a verificação de um membro (staff)')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true)));

async function main() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  const route = process.env.GUILD_ID
    ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
    : Routes.applicationCommands(process.env.CLIENT_ID);
  await rest.put(route, { body: [command.toJSON()] });
  console.log('Comandos registrados com sucesso.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
