const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('giveaway')
  .setDescription('Sistema de sorteios')
  .addSubcommand(sub => sub
    .setName('create')
    .setDescription('Cria um sorteio')
    .addStringOption(opt => opt.setName('premio').setDescription('Prêmio').setRequired(true))
    .addIntegerOption(opt => opt.setName('minutos').setDescription('Duração em minutos').setRequired(true).setMinValue(1).setMaxValue(10080))
    .addIntegerOption(opt => opt.setName('ganhadores').setDescription('Quantidade de ganhadores').setRequired(false).setMinValue(1).setMaxValue(20)))
  .addSubcommand(sub => sub.setName('list').setDescription('Lista sorteios ativos'))
  .addSubcommand(sub => sub
    .setName('reroll')
    .setDescription('Sorteia novamente um sorteio finalizado/ativo')
    .addStringOption(opt => opt.setName('message_id').setDescription('ID da mensagem do sorteio').setRequired(true)));

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
