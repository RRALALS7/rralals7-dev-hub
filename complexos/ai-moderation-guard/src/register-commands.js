const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const command = new SlashCommandBuilder()
  .setName('modos')
  .setDescription('Moderation OS do RRALALS7')
  .addSubcommand(sub => sub
    .setName('status')
    .setDescription('Mostra status geral do sistema'))
  .addSubcommand(sub => sub
    .setName('mode')
    .setDescription('Define modo de moderação (staff)')
    .addStringOption(opt => opt.setName('modo').setDescription('manual, safe, balanced ou strict').setRequired(true)
      .addChoices(
        { name: 'manual', value: 'manual' },
        { name: 'safe', value: 'safe' },
        { name: 'balanced', value: 'balanced' },
        { name: 'strict', value: 'strict' }
      )))
  .addSubcommand(sub => sub
    .setName('analyze')
    .setDescription('Analisa texto manualmente (staff)')
    .addStringOption(opt => opt.setName('texto').setDescription('Texto para analisar').setRequired(true)))
  .addSubcommand(sub => sub
    .setName('guardian_status')
    .setDescription('Mostra status do Server Guardian'))
  .addSubcommand(sub => sub
    .setName('panic_on')
    .setDescription('Ativa modo pânico e trava canais (staff)'))
  .addSubcommand(sub => sub
    .setName('panic_off')
    .setDescription('Desativa modo pânico (staff)'))
  .addSubcommand(sub => sub
    .setName('staff_analyze')
    .setDescription('Analisa histórico recente de um usuário (staff)')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true)))
  .addSubcommand(sub => sub
    .setName('appeal_open')
    .setDescription('Abre pedido de revisão')
    .addStringOption(opt => opt.setName('motivo').setDescription('Explique seu pedido').setRequired(true)))
  .addSubcommand(sub => sub
    .setName('appeal_status')
    .setDescription('Mostra seus pedidos de revisão'))
  .addSubcommand(sub => sub
    .setName('appeal_review')
    .setDescription('Revisa um appeal (staff)')
    .addStringOption(opt => opt.setName('id').setDescription('ID do appeal').setRequired(true))
    .addStringOption(opt => opt.setName('status').setDescription('novo status').setRequired(true)
      .addChoices(
        { name: 'accepted', value: 'accepted' },
        { name: 'denied', value: 'denied' },
        { name: 'pending', value: 'pending' }
      ))
    .addStringOption(opt => opt.setName('resposta').setDescription('Resposta da staff').setRequired(false)))
  .addSubcommand(sub => sub
    .setName('rep_give')
    .setDescription('Dá reputação positiva para um membro')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true))
    .addStringOption(opt => opt.setName('motivo').setDescription('Motivo').setRequired(false)))
  .addSubcommand(sub => sub
    .setName('rep_profile')
    .setDescription('Mostra reputação')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(false)))
  .addSubcommand(sub => sub
    .setName('rep_leaderboard')
    .setDescription('Ranking de reputação'))
  .addSubcommand(sub => sub
    .setName('rep_reset')
    .setDescription('Reseta reputação de um membro (staff)')
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
