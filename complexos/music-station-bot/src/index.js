const dotenv = require('dotenv');
dotenv.config();

const { Client, EmbedBuilder, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');
const radios = require('./config/radios');
const player = require('./player');

const DJ_ROLE_NAME = process.env.DJ_ROLE_NAME || 'DJ';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

function embed(title, description, color = 0x7c3aed) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'Music Station • RRALALS7' })
    .setTimestamp();
}

function voiceChannel(interaction) {
  return interaction.member?.voice?.channel || null;
}

function isValidAudioUrl(input) {
  try {
    const url = new URL(input);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function hasDjPermission(interaction) {
  const state = player.getState(interaction.guildId);
  if (!state.djMode) return true;
  if (interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) return true;
  return interaction.member.roles.cache.some(role => role.name === DJ_ROLE_NAME);
}

function queueText(state) {
  if (!state.queue.length) return 'Fila vazia.';
  return state.queue.slice(0, 10).map((track, index) => `${index + 1}. **${track.title}**`).join('\n');
}

client.once('ready', () => console.log(`Music Station Bot online como ${client.user.tag}`));

client.on('interactionCreate', async interaction => {
  try {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'music') return;
    const sub = interaction.options.getSubcommand();
    const state = player.getState(interaction.guildId);

    if (['pause', 'resume', 'skip', 'stop', 'clear', 'volume', 'loop', 'djmode'].includes(sub) && !hasDjPermission(interaction)) {
      return interaction.reply({ content: `DJ mode está ativo. Você precisa do cargo **${DJ_ROLE_NAME}** ou permissão de gerenciar servidor.`, ephemeral: true });
    }

    if (sub === 'join') {
      const channel = voiceChannel(interaction);
      if (!channel) return interaction.reply({ content: 'Entre em um canal de voz primeiro.', ephemeral: true });
      await interaction.deferReply();
      await player.connectToChannel(channel);
      return interaction.editReply({ embeds: [embed('🎵 Conectado', `Entrei em **${channel.name}**.`)] });
    }

    if (sub === 'leave') {
      player.disconnect(interaction.guildId);
      return interaction.reply({ embeds: [embed('👋 Desconectado', 'Saí do canal de voz e limpei a fila.')] });
    }

    if (sub === 'play') {
      const channel = voiceChannel(interaction);
      if (!channel) return interaction.reply({ content: 'Entre em um canal de voz primeiro.', ephemeral: true });

      const url = interaction.options.getString('url');
      const title = interaction.options.getString('titulo') || 'Áudio direto';
      if (!isValidAudioUrl(url)) return interaction.reply({ content: 'URL inválida. Use uma URL direta de áudio/stream permitido.', ephemeral: true });

      await interaction.deferReply();
      await player.connectToChannel(channel);
      const updated = player.addTrack(interaction.guildId, { title, url, requestedBy: interaction.user.id });
      return interaction.editReply({ embeds: [embed('➕ Adicionado à fila', `**${title}**\nPosição na fila: ${updated.queue.length}`)] });
    }

    if (sub === 'radio') {
      const channel = voiceChannel(interaction);
      if (!channel) return interaction.reply({ content: 'Entre em um canal de voz primeiro.', ephemeral: true });

      const preset = interaction.options.getString('preset');
      const radio = radios.find(item => item.id === preset);
      if (!radio) return interaction.reply({ content: `Preset não encontrado. Disponíveis: ${radios.map(r => r.id).join(', ')}`, ephemeral: true });

      await interaction.deferReply();
      await player.connectToChannel(channel);
      player.addTrack(interaction.guildId, { title: radio.name, url: radio.url, requestedBy: interaction.user.id });
      return interaction.editReply({ embeds: [embed('📻 Rádio adicionada', `**${radio.name}** foi adicionada à fila.`)] });
    }

    if (sub === 'pause') {
      player.pause(interaction.guildId);
      return interaction.reply({ embeds: [embed('⏸️ Pausado', 'Player pausado.')] });
    }

    if (sub === 'resume') {
      player.resume(interaction.guildId);
      return interaction.reply({ embeds: [embed('▶️ Continuando', 'Player retomado.')] });
    }

    if (sub === 'skip') {
      player.skip(interaction.guildId);
      return interaction.reply({ embeds: [embed('⏭️ Skip', 'Faixa pulada.')] });
    }

    if (sub === 'stop') {
      player.stop(interaction.guildId);
      return interaction.reply({ embeds: [embed('⏹️ Stop', 'Player parado e fila limpa.')] });
    }

    if (sub === 'queue') {
      return interaction.reply({ embeds: [embed('📜 Fila', queueText(state))] });
    }

    if (sub === 'nowplaying') {
      const current = state.current ? `**${state.current.title}**` : 'Nada tocando agora.';
      return interaction.reply({ embeds: [embed('🎶 Tocando agora', current)] });
    }

    if (sub === 'volume') {
      const volume = interaction.options.getInteger('valor');
      const updated = player.setVolume(interaction.guildId, volume);
      return interaction.reply({ embeds: [embed('🔊 Volume', `Volume definido para **${updated.volume}%**.`)] });
    }

    if (sub === 'loop') {
      const mode = interaction.options.getString('modo');
      const updated = player.setLoop(interaction.guildId, mode);
      return interaction.reply({ embeds: [embed('🔁 Loop', `Modo de loop: **${updated.loop}**.`)] });
    }

    if (sub === 'clear') {
      player.clearQueue(interaction.guildId);
      return interaction.reply({ embeds: [embed('🧹 Fila limpa', 'A fila foi limpa.')] });
    }

    if (sub === 'djmode') {
      if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.reply({ content: 'Apenas staff pode alterar DJ mode.', ephemeral: true });
      }
      state.djMode = interaction.options.getBoolean('ativo');
      return interaction.reply({ embeds: [embed('🎧 DJ Mode', `DJ mode: **${state.djMode ? 'ativado' : 'desativado'}**.`)] });
    }
  } catch (error) {
    console.error(error);
    if (interaction.deferred) return interaction.editReply('Erro no Music Station Bot. Verifique URL, permissões e canal de voz.');
    if (!interaction.replied) return interaction.reply({ content: 'Erro no Music Station Bot.', ephemeral: true }).catch(() => null);
  }
});

client.login(process.env.DISCORD_TOKEN);
