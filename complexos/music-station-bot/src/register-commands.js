const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('music')
  .setDescription('Music Station Bot')
  .addSubcommand(sub => sub.setName('join').setDescription('Entra no seu canal de voz'))
  .addSubcommand(sub => sub.setName('leave').setDescription('Sai do canal de voz'))
  .addSubcommand(sub => sub
    .setName('play')
    .setDescription('Toca uma URL direta de áudio permitida')
    .addStringOption(opt => opt.setName('url').setDescription('URL direta de áudio/stream permitido').setRequired(true))
    .addStringOption(opt => opt.setName('titulo').setDescription('Título opcional').setRequired(false)))
  .addSubcommand(sub => sub
    .setName('radio')
    .setDescription('Toca uma rádio preset')
    .addStringOption(opt => opt.setName('preset').setDescription('ID do preset').setRequired(true)))
  .addSubcommand(sub => sub.setName('pause').setDescription('Pausa a música'))
  .addSubcommand(sub => sub.setName('resume').setDescription('Continua a música'))
  .addSubcommand(sub => sub.setName('skip').setDescription('Pula a faixa atual'))
  .addSubcommand(sub => sub.setName('stop').setDescription('Para e limpa a fila'))
  .addSubcommand(sub => sub.setName('queue').setDescription('Mostra a fila'))
  .addSubcommand(sub => sub.setName('nowplaying').setDescription('Mostra o que está tocando'))
  .addSubcommand(sub => sub
    .setName('volume')
    .setDescription('Define volume de 1 a 100')
    .addIntegerOption(opt => opt.setName('valor').setDescription('Volume').setRequired(true).setMinValue(1).setMaxValue(100)))
  .addSubcommand(sub => sub
    .setName('loop')
    .setDescription('Define modo de loop')
    .addStringOption(opt => opt.setName('modo').setDescription('off, track ou queue').setRequired(true)
      .addChoices(
        { name: 'off', value: 'off' },
        { name: 'track', value: 'track' },
        { name: 'queue', value: 'queue' }
      )))
  .addSubcommand(sub => sub.setName('clear').setDescription('Limpa a fila'))
  .addSubcommand(sub => sub
    .setName('djmode')
    .setDescription('Ativa/desativa DJ mode')
    .addBooleanOption(opt => opt.setName('ativo').setDescription('Ativar?').setRequired(true)));

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
