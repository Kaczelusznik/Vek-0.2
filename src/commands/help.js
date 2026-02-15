// src/commands/help.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lista komend bota VEK 0.2")
    .addStringOption((opt) =>
      opt
        .setName("kategoria")
        .setDescription("Wybierz kategorię komend")
        .addChoices(
          { name: "Ogólne", value: "general" },
          { name: "Profil / Level", value: "profile" },
          { name: "Ekonomia", value: "economy" },
          { name: "Info", value: "info" },
          { name: "Admin", value: "admin" }
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    const cat = interaction.options.getString("kategoria");

    // Wystarczy, że w przyszłości dopiszesz tu jedną linijkę — embed buduje się z tej listy.
    const COMMANDS = {
      general: [
        { cmd: "/help [kategoria]", desc: "Pokazuje listę komend." },
        { cmd: "/botinfo", desc: "Info o bocie (wersja, uptime, ping)." },
      ],
      profile: [
        { cmd: "/profil [user]", desc: "Twój profil: saldo, level, exp." },
        { cmd: "/balance [user]", desc: "Szybkie saldo (bez profilu)." },
      ],
      economy: [
        { cmd: "/transfer user kwota", desc: "Przelej kasę innemu graczowi." },
      ],
      info: [
        { cmd: "/avatar [user]", desc: "Wyświetla avatar użytkownika." },
        { cmd: "/userinfo [user]", desc: "Informacje o użytkowniku." },
        { cmd: "/serverinfo", desc: "Informacje o serwerze." },
      ],
      admin: [
        { cmd: "/add-money user kwota", desc: "Dodaj kasę (admin/mod)." },
        { cmd: "/remove-money user kwota", desc: "Zabierz kasę (admin/mod)." },
        { cmd: "/set-money user kwota", desc: "Ustaw saldo (admin/mod)." },
        { cmd: "/set-level user level", desc: "Ustaw level (admin/mod)." },
        { cmd: "/reset-user user", desc: "Reset profilu (admin/mod)." },
      ],
    };

    const titles = {
      general: "🧭 Ogólne",
      profile: "👤 Profil / Level",
      economy: "💸 Ekonomia",
      info: "ℹ️ Info",
      admin: "🛡 Admin",
    };

    const embed = new EmbedBuilder()
      .setTitle("VEK 0.2 — Help")
      .setDescription(
        "Użyj **/help kategoria:** żeby zobaczyć konkretną sekcję.\n" +
          "Poniżej masz komendy dostępne na start."
      )
      .setFooter({ text: "VEK 0.2 • bot serwerowy (ekonomia + levele + roll)" })
      .setTimestamp();

    // Jeśli użytkownik poda kategorię — pokaż tylko tę.
    if (cat && COMMANDS[cat]) {
      const lines = COMMANDS[cat].map((x) => `• **${x.cmd}** — ${x.desc}`).join("\n");
      embed.addFields({ name: titles[cat], value: lines || "Brak komend.", inline: false });
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Jeśli nie poda kategorii — pokaż skrót (po 2–3 najważniejsze z każdej).
    const preview = (arr, n = 3) => arr.slice(0, n).map((x) => `• **${x.cmd}** — ${x.desc}`).join("\n");

    embed.addFields(
      { name: titles.general, value: preview(COMMANDS.general, 2), inline: false },
      { name: titles.profile, value: preview(COMMANDS.profile, 2), inline: false },
      { name: titles.economy, value: preview(COMMANDS.economy, 2), inline: false },
      { name: titles.info, value: preview(COMMANDS.info, 3), inline: false },
      { name: titles.admin, value: "Tylko dla administracji serwera.", inline: false }
    );

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
