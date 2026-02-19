// src/commands/help.js
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lista wszystkich komend bota VEK 0.2"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("📖 VEK 0.2 — Komendy")
      .setDescription(
        "Poniżej masz pełną listę komend podzieloną na kategorie.\n" +
          "Niektóre komendy mogą wymagać uprawnień (np. admin)."
      )
      .addFields(
        {
          name: "🧭 Ogólne",
          value:
            "• `/ping` — sprawdza czy bot działa\n" +
            "• `/help` — lista komend\n" +
            "• `/botinfo` — info o bocie (ping, uptime, system)",
          inline: false,
        },
        {
          name: "🎲 Roll",
          value:
            "• `/roll rzut:<np. 2k6+3>` — rzut kością w formacie k\n",
          inline: false,
        },
        {
          name: "👤 Profil / Level",
          value:
            "• `/profil [user]` — profil (saldo, level, exp)\n" +
            "• `/balance` — twoje saldo\n" +
            "• `/balance [user]` — saldo użytkownika",
          inline: false,
        },
        {
          name: "💸 Ekonomia",
          value:
            "• `/transfer user kwota` — przelew do gracza\n" +
            "• `/leaderboard` — ranking graczy",
          inline: false,
        },
        {
          name: "ℹ️ Info",
          value:
            "• `/avatar [user]` — pokazuje avatar\n" +
            "• `/userinfo [user]` — info o użytkowniku\n" +
            "• `/serverinfo` — info o serwerze",
          inline: false,
        },
        {
          name: "🛡 Admin",
          value:
            "• `/add-money user kwota` — dodaj kasę\n" +
            "• `/remove-money user kwota` — zabierz kasę\n" +
            "• `/set-money user kwota` — ustaw saldo\n" +
            "• `/set-level user level` — ustaw level\n" +
            "• `/reset-user user` — reset profilu\n\n" +
            "_Dostępne tylko dla admin/mod._",
          inline: false,
        }
      )
      .setFooter({ text: "VEK 0.2 • Ekonomia • Levele • Roll" })
      .setTimestamp();

    return interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  },
};
