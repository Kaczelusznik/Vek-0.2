// src/commands/help.js
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lista wszystkich komend bota VEK 0.2"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("VEK 0.2 — Komendy")
      .setDescription(
        "Poniżej znajduje się pełna lista komend podzielona na kategorie.\n" +
          "Niektóre komendy mogą wymagać uprawnień (np. admin)."
      )
      .addFields(
        {
          name: "Ogólne",
          value:
            "• `/ping` — sprawdza czy bot działa\n" +
            "• `/help` — lista komend\n" +
            "• `/botinfo` — info o bocie (ping, uptime, system)",
          inline: false,
        },
        {
          name: "Roll",
          value: "• `/roll rzut:<np. 2k6+3>` — rzut kością w formacie k",
          inline: false,
        },
        {
          name: "Ekonomia",
          value:
            "• `/leaderboard` — ranking bogaczy\n" +
            "• `/addmoney` — dodaj monety (admin/mod)\n" +
            "• `/removemoney` — zabierz monety (admin/mod)",
          inline: false,
        }
      )
      .setFooter({ text: "VEK 0.2" })
      .setTimestamp();

    return interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  },
};