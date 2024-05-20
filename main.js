require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const child_process = require("child_process");
const ffmpeg = require("ffmpeg-static");

const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let voiceConnection;

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  if (!message.guild) return;

  if (message.content === "/marvbot") {
    if (message.member.voice.channel) {
      if (
        !voiceConnection ||
        voiceConnection.joinConfig.channelId !== message.member.voice.channel.id
      ) {
        voiceConnection = joinVoiceChannel({
          channelId: message.member.voice.channel.id,
          guildId: message.guild.id,
          adapterCreator: message.guild.voiceAdapterCreator,
          selfDeaf: false,
        });

        voiceConnection.on(VoiceConnectionStatus.Ready, () => {
          console.log("The bot has connected to the channel!");
          message.reply("Joined the voice channel!");
        });
      } else {
        message.reply("Already connected to this voice channel!");
      }
    } else {
      message.reply("You need to join a voice channel first!");
    }
  } else if (message.content === "/kmhd") {
    play_kmhd(message, voiceConnection);
  }
});
client.login(token);

async function play_kmhd(message, voiceConnection) {
  if (!voiceConnection) {
    message.reply("I need to be in a voice channel first. Use `/join`.");
    return;
  }

  const m3u8Url =
    "https://ais-sa3.cdnstream1.com/2442_128.aac/playlist.m3u8?aw_0_1st.playerid=esPlayer&aw_0_1st.skey=1715963358";

  const ffmpegProcess = child_process.spawn(
    ffmpeg,
    [
      "-i",
      m3u8Url,
      "-acodec",
      "pcm_s16le", // Output audio as raw PCM
      "-b:a",
      "32k", // Bitrate
      "-ar",
      "48000", // Sample rate
      "-ac",
      "2", // Stereo
      "-f",
      "s16le", // Output format for PCM
      "pipe:1", // Output to a pipe
    ],
    { stdio: ["ignore", "pipe", "pipe"] }
  );

  ffmpegProcess.stderr.on("data", (data) => {
    // console.log(`FFmpeg: ${data.toString()}`);
  });

  ffmpegProcess.on("close", (code, signal) => {
    console.log(
      `:( FFmpeg process exited with code ${code} and signal ${signal}`
    );
    let retryCount = 0;
    const maxRetries = 10;
    if (retryCount < maxRetries) {
      console.log(
        "*********************************Attempting to reconnect..."
      );
      retryCount++;
      play_kmhd(message, voiceConnection); // Retry streaming
    } else {
      console.log("Max retries reached, stopping...");
      player.stop();
    }
  });

  const resource = createAudioResource(ffmpegProcess.stdout, {
    inputType: StreamType.Raw,
    inlineVolume: true,
  });
  resource.volume.setVolume(1);
  const player = createAudioPlayer();

  player.play(resource);
  voiceConnection.subscribe(player);

  // Player error handling
  player.on("error", (error) => {
    console.error("Error in audio player:", error);
    player.stop();
  });

  // Voice connection disconnection handling
  voiceConnection.on(VoiceConnectionStatus.Disconnected, async () => {
    try {
      player.stop();
      await voiceConnection.destroy();
      console.log("Cleaned up resources after disconnection.");
    } catch (error) {
      console.error("Error cleaning up resources:", error);
    }
  });
  message.reply("Playing now!");
}
