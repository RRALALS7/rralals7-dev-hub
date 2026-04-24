const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('ask').setDescription('Pergunta algo para o assistente seguro').addStringOption(opt => opt.setName('pergunta').setDescription('Sua pergunta').setRequired(true)),
  new SlashCommandBuilder().setName('faq').setDescription('Gerencia FAQ do servidor')
    .addSubcommand(sub => sub.setName('add').setDescription('Adiciona FAQ').addStringOption(opt => opt.setName('chave').setDescription('Chave').setRequired(true)).addStringOption(opt => opt.setName('resposta').setDescription('Resposta').setRequired(true)))
    .addSubcommand(sub => sub.setName('list').setDescription('Lista FAQs'))
    .addSubcommand(sub => sub.setName('remove').setDescription('Remove FAQ').addStringOption(opt => opt.setName('chave').setDescription('Chave').setRequired(true)))
].map(command => command.toJSON());

async function main() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  const route = process.env.GUILD_ID ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID) : Routes.applicationCommands(process.env.CLIENT_ID);
  await rest.put(route, { body: commands });
  console.log('Comandos registrados com sucesso.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
