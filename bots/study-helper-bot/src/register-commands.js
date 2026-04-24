const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('study')
  .setDescription('Sistema simples de estudos')
  .addSubcommand(sub => sub
    .setName('add')
    .setDescription('Adiciona flashcard')
    .addStringOption(opt => opt.setName('pergunta').setDescription('Pergunta').setRequired(true))
    .addStringOption(opt => opt.setName('resposta').setDescription('Resposta').setRequired(true)))
  .addSubcommand(sub => sub.setName('list').setDescription('Lista seus flashcards'))
  .addSubcommand(sub => sub.setName('quiz').setDescription('Mostra um flashcard aleatório'))
  .addSubcommand(sub => sub
    .setName('remove')
    .setDescription('Remove flashcard pelo ID')
    .addStringOption(opt => opt.setName('id').setDescription('ID').setRequired(true)));

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
