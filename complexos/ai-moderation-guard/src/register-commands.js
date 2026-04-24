const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('aiguard')
  .setDescription('Configuração do AI Moderation Guard')
  .addSubcommand(sub => sub
    .setName('status')
    .setDescription('Mostra status do guard'))
  .addSubcommand(sub => sub
    .setName('mode')
    .setDescription('Define modo de moderação')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt => opt.setName('modo').setDescription('manual, safe, balanced ou strict').setRequired(true)
      .addChoices(
        { name: 'manual', value: 'manual' },
        { name: 'safe', value: 'safe' },
        { name: 'balanced', value: 'balanced' },
        { name: 'strict', value: 'strict' }
      )))
  .addSubcommand(sub => sub
    .setName('analyze')
    .setDescription('Analisa texto manualmente')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(opt => opt.setName('texto').setDescription('Texto para analisar').setRequired(true)));

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
