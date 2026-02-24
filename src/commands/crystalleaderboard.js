// src/commands/crystalleaderboard.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { topCrystalBalances } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crystalleaderboard")
    .setDescription("Top bogaczy na serwerze (kryształy)")
    .addIntegerOption((opt) =>
      opt.setName("limit").setDescription("Ile pozycji? (1-20)").setMinValue(1).setMaxValue(20)
    ),

  async execute(interaction) {
    try {
      const limit = interaction.options.getInteger("limit") ?? 10;
      const rows = await topCrystalBalances(interaction.guildId, limit);

      const embed = new EmbedBuilder()
        .setTitle("<:krysztalwaluta:1475641863552630844> Leaderboard - kryształy")
        .setColor(0x7b5cff)
        .setDescription(
          rows.length
            ? rows
                .map((r, i) => {
                  const val = Number(r.crystal_balance);
                  const shown = Number.isFinite(val) ? val.toFixed(2) : "0.00";
                  return `**${i + 1}.** <@${r.user_id}> — **${shown}** <:krysztalwaluta:1475641863552630844>`;
                })
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