const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls a dice with the number of sides that you choose.")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription(
          "The number of sides to the dice you want rolled.  Must be a number greater than 0."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const sidedDice = interaction.options.getInteger("sides");
    const roll = Math.floor(Math.random() * sidedDice) + 1;
    await interaction.reply(roll.toLocaleString());
  },
};
