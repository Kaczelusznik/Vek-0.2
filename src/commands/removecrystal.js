// src/commands/removecrystal.js
const { SlashCommandBuilder } = require("discord.js");
const { removeCrystal } = require("../db");

const ALLOWED_ROLES = [
  "【♔ Moderator ♔ 】",
  "【 ♘ Mistrz Gry ♘】",
  "【♕ Administrator ♕】",
  "Imperator",
];

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
    .setName("removecrystal")
    .setDescription("Zabierz kryształy graczowi")
    .addUserOption((opt) =>
      opt.setName("gracz").setDescription("Komu zabrać?").setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("kwota")
        .setDescription("Ile zabrać? (np. 10, 10.5, 10.50)")
        .setRequired(true)
    )
    .addBooleanOption((opt) =>
      opt.setName("moze_ujemne").setDescription("Czy saldo może spaść poniżej 0?")
    ),

  async execute(interaction) {
    if (!interaction.member?.roles?.cache.some((r) => ALLOWED_ROLES.includes(r.name))) {
      return interaction.editReply({ content: "Nie masz uprawnień." });
    }

    try {
      const target = interaction.options.getUser("gracz", true);
      const amountStr = interaction.options.getString("kwota", true);
      const amountFixed = parseCrystalAmount(amountStr);
      const allowNegative = interaction.options.getBoolean("moze_ujemne") ?? false;

      const res = await removeCrystal(interaction.guildId, target.id, amountFixed, { allowNegative });

      if (!res.ok) {
        return interaction.editReply({
          content: `${target} ma tylko **${Number(res.current).toFixed(
            2
          )}** <:krysztalwaluta:1475641863552630844>.`,
          allowedMentions: { users: [target.id] },
        });
      }

      return interaction.editReply({
        content: `Zabrano **${amountFixed}** <:krysztalwaluta:1475641863552630844> ${target}. Saldo: **${Number(res.current).toFixed(
          2
        )} → ${Number(res.next).toFixed(2)}**`,
        allowedMentions: { users: [target.id] },
      });
    } catch (err) {
      return interaction.editReply({ content: `Błąd: ${err.message}` });
    }
  },
};