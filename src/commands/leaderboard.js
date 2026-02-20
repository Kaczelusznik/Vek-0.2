// src/commands/leaderboard.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { topBalances } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Top bogaczy na serwerze")
    .addIntegerOption((opt) =>
      opt.setName("limit").setDescription("Ile pozycji? (1-20)").setMinValue(1).setMaxValue(20)
    ),

  async execute(interaction) {
    try {
      const limit = interaction.options.getInteger("limit") ?? 10;
      const rows = await topBalances(interaction.guildId, limit);

      const embed = new EmbedBuilder()
        .setTitle("🏆 Leaderboard - monety")
        .setColor(0x20bd4a)
        .setDescription(
          rows.length
            ? rows
                .map((r, i) => `**${i + 1}.** <@${r.user_id}> — **${r.balance}** 💰`)
                .join("\n")
            : "Brak danych."
        )
        .setFooter({ text: "Jo nie wiedzioł, że tok dobrze wom idzie" })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      return interaction.editReply({ content: `Błąd: ${err.message}` });
    }
  },
};