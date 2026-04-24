const dotenv = require('dotenv');
dotenv.config();

const {
  ActionRowBuilder,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  PermissionsBitField,
  StringSelectMenuBuilder
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

function embed(title, description) {
  return new EmbedBuilder()
    .setColor(0x7c3aed)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'RRALALS7 sempre ajuda.' })
    .setTimestamp();
}

client.once('ready', () => {
  console.log(`Auto Roles Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName !== 'roles') return;

      if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: 'Apenas administradores podem criar painel de cargos.', ephemeral: true });
      }

      const roles = [];
      for (let i = 1; i <= 10; i++) {
        const role = interaction.options.getRole(`cargo${i}`);
        if (role) roles.push(role);
      }

      const invalidRole = roles.find(role => role.permissions.has(PermissionsBitField.Flags.Administrator));
      if (invalidRole) {
        return interaction.reply({ content: `Não coloque cargo administrativo no painel: ${invalidRole.name}`, ephemeral: true });
      }

      const menu = new StringSelectMenuBuilder()
        .setCustomId('auto_roles_select')
        .setPlaceholder('Escolha seus cargos')
        .setMinValues(0)
        .setMaxValues(roles.length)
        .addOptions(roles.map(role => ({ label: role.name.slice(0, 100), value: role.id })));

      const row = new ActionRowBuilder().addComponents(menu);

      return interaction.reply({
        embeds: [embed('🔐 Auto-Cargos', 'Selecione no menu abaixo os cargos que você quer receber ou remover.')],
        components: [row]
      });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'auto_roles_select') {
      const selected = new Set(interaction.values);
      const allRoleIds = interaction.component.options.map(option => option.value);

      for (const roleId of allRoleIds) {
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) continue;

        if (selected.has(roleId)) {
          await interaction.member.roles.add(role).catch(() => null);
        } else {
          await interaction.member.roles.remove(role).catch(() => null);
        }
      }

      return interaction.reply({ content: 'Seus cargos foram atualizados.', ephemeral: true });
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({ content: 'Ocorreu um erro ao atualizar cargos.', ephemeral: true }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
