const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('tournament')
  .setDescription('Sistema de torneios gamer')
  .addSubcommand(sub => sub
    .setName('create')
    .setDescription('Cria um torneio')
    .addStringOption(opt => opt.setName('nome').setDescription('Nome do torneio').setRequired(true))
    .addIntegerOption(opt => opt.setName('vagas').setDescription('Quantidade máxima de participantes').setRequired(true).setMinValue(2).setMaxValue(128)))
  .addSubcommand(sub => sub.setName('join').setDescription('Entrar no torneio ativo'))
  .addSubcommand(sub => sub.setName('leave').setDescription('Sair do torneio ativo'))
  .addSubcommand(sub => sub.setName('list').setDescription('Listar participantes'))
  .addSubcommand(sub => sub.setName('bracket').setDescription('Gerar chaveamento simples'))
  .addSubcommand(sub => sub.setName('end').setDescription('Encerrar torneio ativo'));

const commands = [command.toJSON()];

async function main() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
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
