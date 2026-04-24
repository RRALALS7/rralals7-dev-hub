require('dotenv').config();

const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Testa se o bot está online.'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Mostra a lista de comandos.'),

  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Sistema de tickets.')
    .addSubcommand(sub => sub
      .setName('setup')
      .setDescription('Cria painel de tickets.')
      .addChannelOption(opt => opt.setName('logs').setDescription('Canal de logs dos tickets').setRequired(false))
      .addRoleOption(opt => opt.setName('staff').setDescription('Cargo da staff').setRequired(false)))
    .addSubcommand(sub => sub
      .setName('close')
      .setDescription('Fecha o ticket atual.')),

  new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Sistema de auto-cargos.')
    .addSubcommand(sub => sub
      .setName('setup')
      .setDescription('Cria painel com até 5 cargos.')
      .addRoleOption(opt => opt.setName('cargo1').setDescription('Cargo 1').setRequired(true))
      .addRoleOption(opt => opt.setName('cargo2').setDescription('Cargo 2').setRequired(false))
      .addRoleOption(opt => opt.setName('cargo3').setDescription('Cargo 3').setRequired(false))
      .addRoleOption(opt => opt.setName('cargo4').setDescription('Cargo 4').setRequired(false))
      .addRoleOption(opt => opt.setName('cargo5').setDescription('Cargo 5').setRequired(false))),

  new SlashCommandBuilder()
    .setName('roblox')
    .setDescription('Utilitários públicos Roblox.')
    .addSubcommand(sub => sub
      .setName('user')
      .setDescription('Busca perfil público Roblox por username.')
      .addStringOption(opt => opt.setName('username').setDescription('Username Roblox').setRequired(true))),

  new SlashCommandBuilder()
    .setName('checklink')
    .setDescription('Verifica se um link parece suspeito.')
    .addStringOption(opt => opt.setName('url').setDescription('Link para verificar').setRequired(true)),

  new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Cria uma enquete simples.')
    .addStringOption(opt => opt.setName('pergunta').setDescription('Pergunta da enquete').setRequired(true))
    .addStringOption(opt => opt.setName('opcao1').setDescription('Opção 1').setRequired(true))
    .addStringOption(opt => opt.setName('opcao2').setDescription('Opção 2').setRequired(true))
    .addStringOption(opt => opt.setName('opcao3').setDescription('Opção 3').setRequired(false))
    .addStringOption(opt => opt.setName('opcao4').setDescription('Opção 4').setRequired(false)),

  new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Cria um sorteio simples.')
    .addStringOption(opt => opt.setName('premio').setDescription('Prêmio do sorteio').setRequired(true))
    .addIntegerOption(opt => opt.setName('minutos').setDescription('Duração em minutos').setRequired(true).setMinValue(1).setMaxValue(10080))
].map(cmd => cmd.toJSON());

async function main() {
  const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

  if (!DISCORD_TOKEN || !CLIENT_ID) {
    console.error('Configure DISCORD_TOKEN e CLIENT_ID no .env');
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

  if (GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('✅ Comandos registrados no servidor informado.');
  } else {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('✅ Comandos globais registrados. Podem demorar para aparecer.');
  }
}

main().catch(err => {
  console.error('Erro ao registrar comandos:', err);
  process.exit(1);
});
