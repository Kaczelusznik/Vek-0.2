// src/commands/help.js
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

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

    const COMMANDS = {
      general: [
        { cmd: "/ping", desc: "Sprawdza czy bot działa" },
        { cmd: "/help [kategoria]", desc: "Pokazuje listę komend." },
        { cmd: "/botinfo", desc: "Info o bocie (wersja, uptime, ping)." },
      ],
      profile: [
        { cmd: "/profil [user]", desc: "Twój profil: saldo, level, exp." },
        { cmd: "/balance", desc: "Sprawdzenie salda" },
        { cmd: "/balance [user]", desc: "Saldo wybranego użytkownika." },
      ],
      economy: [
        { cmd: "/transfer", desc: "Przekazanie waluty" },
        { cmd: "/transfer user kwota", desc: "Przelej kasę innemu graczowi." },
        { cmd: "/leaderboard", desc: "Ranking graczy" },
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

    const makeTable = (rows) => {
      const header = "| Komenda | Opis |\n| --- | --- |\n";
      const body = rows.map((r) => `| \`${r.cmd}\` | ${r.desc} |`).join("\n");
      return header + body;
    };

    const embed = new EmbedBuilder()
      .setTitle("VEK 0.2 — Help")
      .setDescription(
        "Użyj **/help kategoria:** żeby zobaczyć konkretną sekcję.\n" +
          "Poniżej masz komendy dostępne na start."
      )
      .setFooter({ text: "VEK 0.2 • bot serwerowy (ekonomia + levele + roll)" })
      .setTimestamp();

    const replyOpts = { embeds: [embed], flags: MessageFlags.Ephemeral };

    // jeśli wybrano kategorię: jedna tabelka
    if (cat && COMMANDS[cat]) {
      embed.addFields({
        name: titles[cat],
        value: makeTable(COMMANDS[cat]),
        inline: false,
      });
      return interaction.reply(replyOpts);
    }

    // brak kategorii: podgląd jak “tabelka startowa” (Twoje 5 komend)
    const startTable = makeTable([
      { cmd: "/ping", desc: "Sprawdza czy bot działa" },
      { cmd: "/roll", desc: "Rzut kością (np. 2k6+3)" },
      { cmd: "/balance", desc: "Sprawdzenie salda" },
      { cmd: "/transfer", desc: "Przekazanie waluty" },
      { cmd: "/leaderboard", desc: "Ranking graczy" },
    ]);

    embed.addFields(
      { name: "Start", value: startTable, inline: false },
      { name: "Kategorie", value: "Ogólne • Profil / Level • Ekonomia • Info • Admin", inline: false },
      { name: titles.admin, value: "Tylko dla administracji serwera.", inline: false }
    );

    return interaction.reply(replyOpts);
  },
};
