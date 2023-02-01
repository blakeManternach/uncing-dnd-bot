const { SlashCommandBuilder } = require("discord.js");
var fs = require("fs");
const {
  createAudioPlayer,
  joinVoiceChannel,
  getVoiceConnection,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { join } = require("node:path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("audio")
    .setDescription("Plays an audio track of your choosing")
    .addStringOption((option) =>
      option
        .setName("track")
        .setDescription(
          "The track you want to play in the current discord channel"
        )
        .setRequired(true)
        .addChoices(
          { name: "Market", value: "static/Market.mp3" },
          { name: "Pub", value: "static/Pub.mp3" },
          { name: "CountryRiver", value: "static/CountryRiver.mp3" },
          { name: "Storm", value: "static/Storm.mp3" },
          { name: "Seagulls", value: "static/Seagulls.mp3" },
          { name: "NightCrickets", value: "static/NightCrickets.wav" },
          { name: "Forest", value: "static/Forest.wav" },
          { name: "Wind", value: "static/Wind.wav" },
          { name: "Sentient", value: "static/Sentient.mp3" },
          { name: "TenThousandSlain", value: "static/TenThousandSlain.mp3" },
          { name: "DemonLegions", value: "static/DemonLegions.mp3" },
          { name: "TheWorldIsSafe", value: "static/TheWorldIsSafe.mp3" },
          { name: "MissionCommand", value: "static/MissionCommand.mp3" },
          { name: "Stop", value: "Stop" }
        )
    ),

  async execute(interaction) {
    const track = interaction.options.getString("track");

    if (interaction.client.user) {
      const guild = interaction.client.guilds.cache.get(interaction.guildId);
      const member = guild.members.cache.get(interaction.member.user.id);
      var voiceChannel = member.voice.channel;

      if (!voiceChannel) {
        interaction.reply(
          "You must first join a voice channel to use the play command"
        );
        return;
      }

      const connection =
        getVoiceConnection(voiceChannel.guild.id) ??
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

      if (track == "Stop") {
        connection.destroy();
        interaction.reply("Stopped audio.");
      } else {
        const player = createAudioPlayer();
        let resource = createAudioResource(join(process.cwd(), track));
        player.play(resource);
        player.on(AudioPlayerStatus.Idle, () => {
          player.play(createAudioResource(join(process.cwd(), track)));
        });
        connection.subscribe(player);

        interaction.reply(`Playing...`);
      }
    }
  },
};
