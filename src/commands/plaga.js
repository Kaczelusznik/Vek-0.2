const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { getPlagueLevel, setPlagueLevel } = require("../db");

const ALLOWED_ROLES = [
  "【♔ Moderator ♔ 】",
  "【 ♘ Mistrz Gry ♘】",
  "【♕ Administrator ♕】",
  "Imperator",
];

function hasRole(member) {
  return member?.roles?.cache?.some((r) => ALLOWED_ROLES.includes(r.name));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("plaga")
    .setDescription("Poziom Zmory Karmazynu na serwerze")
    .addSubcommand((sc) =>
      sc.setName("show").setDescription("Pokaż aktualny poziom plagi")
    )
    .addSubcommand((sc) =>
      sc
        .setName("set")
        .setDescription("Ustaw poziom plagi (admin/MG)")
        .addIntegerOption((opt) =>
          opt
            .setName("poziom")
            .setDescription("Nowy poziom (0-100)")
            .setMinValue(0)
            .setMaxValue(100)
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand(true);

    if (sub === "show") {
      const lvl = await getPlagueLevel();

      const embed = new EmbedBuilder()
        .setTitle("☣ Zmora Karmazynu")
        .setDescription(`Aktualny poziom plagi na serwerze: **${lvl}/100**`);

      return interaction.reply({ embeds: [embed] });
    }

    if (sub === "set") {
      if (!hasRole(interaction.member)) {
        return interaction.reply({
          content: "Nie masz uprawnień.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const lvl = interaction.options.getInteger("poziom", true);
      const newLvl = await setPlagueLevel(lvl);

      return interaction.reply({
        content: `✅ Ustawiono poziom Zmory Karmazynu na **${newLvl}/100**`,
      });
    }
  },
};