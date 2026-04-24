const {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  StreamType,
  VoiceConnectionStatus
} = require('@discordjs/voice');

const MAX_QUEUE_SIZE = Number(process.env.MAX_QUEUE_SIZE || 50);
const DEFAULT_VOLUME = Number(process.env.DEFAULT_VOLUME || 70);

const states = new Map();

function getState(guildId) {
  if (!states.has(guildId)) {
    const player = createAudioPlayer();
    const state = {
      guildId,
      player,
      queue: [],
      current: null,
      loop: 'off',
      volume: Math.min(100, Math.max(1, DEFAULT_VOLUME)),
      djMode: false,
      connection: null
    };

    player.on(AudioPlayerStatus.Idle, () => handleIdle(state));
    player.on('error', error => {
      console.error('Audio player error:', error);
      handleIdle(state);
    });

    states.set(guildId, state);
  }

  return states.get(guildId);
}

async function connectToChannel(channel) {
  const state = getState(channel.guild.id);
  const existing = getVoiceConnection(channel.guild.id);
  if (existing) {
    state.connection = existing;
    return existing;
  }

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: true
  });

  state.connection = connection;
  connection.subscribe(state.player);
  await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
  return connection;
}

function makeResource(track, volume) {
  const resource = createAudioResource(track.url, {
    inputType: StreamType.Arbitrary,
    inlineVolume: true
  });
  resource.volume?.setVolume(volume / 100);
  return resource;
}

function playNext(state) {
  if (state.loop === 'track' && state.current) {
    state.player.play(makeResource(state.current, state.volume));
    return;
  }

  if (state.loop === 'queue' && state.current) {
    state.queue.push(state.current);
  }

  const next = state.queue.shift();
  state.current = next || null;

  if (!next) return;
  state.player.play(makeResource(next, state.volume));
}

function handleIdle(state) {
  playNext(state);
}

function addTrack(guildId, track) {
  const state = getState(guildId);
  if (state.queue.length >= MAX_QUEUE_SIZE) {
    throw new Error(`Fila cheia. Limite: ${MAX_QUEUE_SIZE}`);
  }

  state.queue.push(track);
  if (!state.current && state.player.state.status !== AudioPlayerStatus.Playing) {
    playNext(state);
  }

  return state;
}

function skip(guildId) {
  const state = getState(guildId);
  state.player.stop(true);
  return state;
}

function stop(guildId) {
  const state = getState(guildId);
  state.queue = [];
  state.current = null;
  state.player.stop(true);
  return state;
}

function pause(guildId) {
  const state = getState(guildId);
  state.player.pause();
  return state;
}

function resume(guildId) {
  const state = getState(guildId);
  state.player.unpause();
  return state;
}

function setVolume(guildId, volume) {
  const state = getState(guildId);
  state.volume = Math.min(100, Math.max(1, Number(volume)));
  return state;
}

function setLoop(guildId, loop) {
  const state = getState(guildId);
  state.loop = loop;
  return state;
}

function clearQueue(guildId) {
  const state = getState(guildId);
  state.queue = [];
  return state;
}

function disconnect(guildId) {
  const state = getState(guildId);
  stop(guildId);
  const connection = getVoiceConnection(guildId);
  if (connection) connection.destroy();
  state.connection = null;
  return state;
}

module.exports = {
  getState,
  connectToChannel,
  addTrack,
  skip,
  stop,
  pause,
  resume,
  setVolume,
  setLoop,
  clearQueue,
  disconnect
};
