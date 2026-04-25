const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { shop } = require('./shop');

const commands = [
  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Mostra seu saldo ou o saldo de outro membro')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuario opcional').setRequired(false)),

  new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Recebe recompensa diaria ficticia'),

  new SlashCommandBuilder()
    .setName('sendcoins')
    .setDescription('Envia coins ficticias para outro membro')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuario').setRequired(true))
    .addIntegerOption(opt => opt.setName('quantia').setDescription('Quantia').setRequired(true).setMinValue(1)),

  new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Mostra a loja ficticia'),

  new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Compra item ficticio')
    .addStringOption(opt =>
      opt
        .setName('item')
        .setDescription('Item da loja')
        .setRequired(true)
        .addChoices(...shop.map(item => ({ name: `${item.name} (${item.price} coins)`, value: item.id })))
    ),

  new SlashCommandBuilder()
    .setName('use')
    .setDescription('Usa um item do seu inventario')
    .addStringOption(opt =>
      opt
        .setName('item')
        .setDescription('Item para usar')
        .setRequired(true)
        .addChoices(...shop.map(item => ({ name: item.name, value: item.id })))
    ),

  new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Mostra seu inventario ficticio'),

  new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Mostra ranking de coins ficticias')
].map(command => command.toJSON());

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
