const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const setup = new SlashCommandBuilder()
  .setName('roles')
  .setDescription('Sistema de auto-cargos')
  .addSubcommand(sub => {
    sub.setName('setup').setDescription('Cria um painel de auto-cargos');
    for (let i = 1; i <= 10; i++) {
      sub.addRoleOption(opt => opt.setName(`cargo${i}`).setDescription(`Cargo ${i}`).setRequired(i === 1));
    }
    return sub;
  });

const commands = [setup.toJSON()];

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
