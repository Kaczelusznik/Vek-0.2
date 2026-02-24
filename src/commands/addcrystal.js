// src/commands/addcrystal.js
const { SlashCommandBuilder } = require("discord.js");
const { addCrystal } = require("../db");

const ALLOWED_ROLES = [
  "【♔ Moderator ♔ 】",
  "【 ♘ Mistrz Gry ♘】",
  "【♕ Administrator ♕】",
  "Imperator",
];

function safeReply(interaction, payload) {
  return interaction.deferred || interaction.replied
    ? interaction.editReply(payload)
    : interaction.reply(payload);
}

function parseCrystalAmount(input) {
  const raw = String(input ?? "").trim().replace(",", ".");
  const n = Number(raw);

  if (!Number.isFinite(n)) throw new Error("Kwota musi być liczbą.");
  if (n <= 0) throw new Error("Kwota musi być > 0.");

  const rounded = Math.round(n * 100) / 100;
  if (!(rounded > 0)) throw new Error("Kwota musi być > 0.");

  return rounded.toFixed(2);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addcrystal")
    .setDescription("Dodaj kryształy graczowi")
    .addUserOption((opt) =>
      opt.setName("gracz").setDescription("Komu dodać?").setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("kwota")
        .setDescription("Ile dodać? (np. 10, 10.5, 10.50)")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member?.roles?.cache.some((r) => ALLOWED_ROLES.includes(r.name))) {
      return safeReply(interaction, { content: "Nie masz uprawnień." });
    }

    try {
      const target = interaction.options.getUser("gracz", true);

      const amountStr = interaction.options.getString("kwota", true);
      const amountFixed = parseCrystalAmount(amountStr);
      const amountNum = Number(amountFixed);

      const newBal = await addCrystal(interaction.guildId, target.id, amountFixed);

      return safeReply(interaction, {
        content: `Dodano **${amountFixed}** <:krysztalwaluta:1475641863552630844> dla ${target}. Saldo: **${(
          newBal - amountNum
        ).toFixed(2)} → ${newBal.toFixed(2)}**`,
        allowedMentions: { users: [target.id] },
      });
    } catch (err) {
      return safeReply(interaction, { content: `Błąd: ${err.message}` });
    }
  },
};