const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Cria enquetes')
  .addSubcommand(sub => sub
    .setName('create')
    .setDescription('Cria uma enquete')
    .addStringOption(opt => opt.setName('pergunta').setDescription('Pergunta da enquete').setRequired(true))
    .addStringOption(opt => opt.setName('opcao1').setDescription('Opção 1').setRequired(true))
    .addStringOption(opt => opt.setName('opcao2').setDescription('Opção 2').setRequired(true))
    .addStringOption(opt => opt.setName('opcao3').setDescription('Opção 3').setRequired(false))
    .addStringOption(opt => opt.setName('opcao4').setDescription('Opção 4').setRequired(false))
    .addStringOption(opt => opt.setName('opcao5').setDescription('Opção 5').setRequired(false)));

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
