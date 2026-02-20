// src/commands/addmoney.js
const { SlashCommandBuilder } = require("discord.js");
const { addMoney } = require("../db");

const ALLOWED_ROLES = ["【♔ Moderator ♔ 】", "【 ♘ Mistrz Gry ♘】", "【♕ Administrator ♕】", "Imperator"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addmoney")
    .setDescription("Dodaj monety graczowi")
    .addUserOption((opt) => opt.setName("gracz").setDescription("Komu dodać?").setRequired(true))
    .addIntegerOption((opt) =>
      opt.setName("kwota").setDescription("Ile dodać?").setMinValue(1).setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member?.roles?.cache.some((r) => ALLOWED_ROLES.includes(r.name))) {
      return interaction.editReply({ content: "Nie masz uprawnień." });
    }

    try {
      const target = interaction.options.getUser("gracz", true);
      const amount = interaction.options.getInteger("kwota", true);

      const newBal = await addMoney(interaction.guildId, target.id, amount);

      return interaction.editReply({
        content: `Dodano ${amount} monet dla ${target}. Saldo: ${newBal - amount} -> ${newBal}`,
        allowedMentions: { users: [target.id] },
      });
    } catch (err) {
      return interaction.editReply({ content: `Błąd: ${err.message}` });
    }
  },
};