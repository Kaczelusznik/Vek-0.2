const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Rzut monetą"),

  async execute(interaction) {
    const r = Math.random() < 0.5 ? "Orzeł" : "Reszka";
    return interaction.reply({ content: `🪙 ${r}` });
  },
};