const { SlashCommandBuilder } = require("discord.js");
const { transferBalance } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("transfer")
    .setDescription("Przelew monet do innego gracza")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("Komu wysłać?").setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("kwota")
        .setDescription("Ile wysłać?")
        .setMinValue(1)
        .setRequired(true)
    ),

  async execute(interaction) {
    const to = interaction.options.getUser("user", true);
    const amount = interaction.options.getInteger("kwota", true);
    const from = interaction.user;

    if (!interaction.guild) {
      return interaction.reply({
        content: "Ta komenda działa tylko na serwerze.",
        ephemeral: true,
      });
    }

    if (to.bot) {
      return interaction.reply({
        content: "Nie możesz wysyłać monet botom.",
        ephemeral: true,
      });
    }

    if (to.id === from.id) {
      return interaction.reply({
        content: "Nie możesz wysłać monet samemu sobie.",
        ephemeral: true,
      });
    }

    try {
      const guildId = interaction.guild.id;
      const res = await transferBalance(guildId, from.id, to.id, amount);

      return interaction.reply({
        content: `<:adminofaszyzm:1001541863486013510> Przelano **${amount}** monet → ${to}. Twoje saldo: **${res.fromBalance}**`,
      });
    } catch (e) {
      console.error("TRANSFER CMD ERROR:", e);

      if (String(e?.message) === "insufficient") {
        return interaction.reply({
          content: "Masz za mało monet.",
          ephemeral: true,
        });
      }

      if (String(e?.message) === "bad_amount") {
        return interaction.reply({
          content: "Zła kwota.",
          ephemeral: true,
        });
      }

      return interaction.reply({
        content: "Błąd przelewu (sprawdź logi).",
        ephemeral: true,
      });
    }
  },
};