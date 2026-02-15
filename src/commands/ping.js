const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Sprawdza czy bot żyje"),

  async execute(interaction) {
    await interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
  },
};
