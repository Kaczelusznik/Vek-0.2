const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lista wszystkich komend bota VEK 0.2"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("📖 VEK 0.2 — Komendy")
      .setColor(0x8b0000) // ciemna czerwień klimatyczna
      .setDescription(
        "Pełna lista komend dostępnych na serwerze.\n" +
        "Niektóre komendy mogą wymagać odpowiednich uprawnień."
      )
      .addFields(
        {
          name: "🧭 Ogólne",
          value:
            "• `/ping` — sprawdza czy bot działa\n" +
            "• `/help` — lista wszystkich komend\n" +
            "• `/botinfo` — informacje o bocie\n" +
            "• `/avatar [user]` — pokazuje avatar użytkownika\n" +
            "• `/userinfo [user]` — informacje o użytkowniku\n" +
            "• `/serverinfo` — informacje o serwerze",
          inline: false,
        },
        {
          name: "🎲 Mechanika",
          value:
            "• `/roll rzut:<np. 2k6+3>` — rzut kością\n" +
            "• `/coinflip` — rzut monetą",
          inline: false,
        },
        {
          name: "💸 Ekonomia",
          value:
            "• `/balance [user]` — sprawdź saldo\n" +
            "• `/transfer user kwota` — przelew do innego gracza\n" +
            "• `/leaderboard` — ranking najbogatszych\n" +
            "• `/addmoney` — dodaj monety (admin/mod)\n" +
            "• `/removemoney` — zabierz monety (admin/mod)\n" +
            "• `/crystalleaderboard` — ranking najbogatszych czarno-rynkowych\n" +
            "• `/addcrystal` — dodaj kryształ (admin/mod)\n" +
            "• `/removecrystal` — zabierz kryształ (admin/mod)",
          inline: false,
        },
        {
          name: "🌍 Świat VEK",
          value:
            "• `/lore frakcja` — opis frakcji lub elementu świata\n" +
            "• `/plaga` — poziom Zmory Karmazynu na serwerze",
          inline: false,
        }
      )
      .setFooter({ text: "VEK 0.2 bot stworzony dla was!" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};