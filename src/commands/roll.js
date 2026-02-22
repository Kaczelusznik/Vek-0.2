// src/commands/roll.js
const { SlashCommandBuilder } = require("discord.js");

const rollCooldown = new Map();

const OPS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
};

function safeReply(interaction, payload) {
  return interaction.deferred || interaction.replied
    ? interaction.followUp(payload)
    : interaction.reply(payload);
}

function parseDiceExpr(input) {
  const m = String(input ?? "")
    .trim()
    .replace(/\s+/g, "")
    .match(/^(\d+)?[kK](\d+)([+\-*]\d+)?$/);

  if (!m) {
    return { ok: false, error: "Format: k20, 2k20, 2k20+5, 2k20*2" };
  }

  const count = m[1] ? Number(m[1]) : 1; // jeśli brak liczby -> 1 kość
  const sides = Number(m[2]);
  const tail = m[3];

  if (!Number.isInteger(count) || !Number.isInteger(sides)) {
    return { ok: false, error: "Niepoprawne liczby." };
  }

  if (count < 1 || count > 50) {
    return { ok: false, error: "Liczba kości 1–50." };
  }

  if (sides < 2 || sides > 1000) {
    return { ok: false, error: "Kość 2–1000 ścian." };
  }

  let operator = null;
  let modifierValue = 0;

  if (tail) {
    operator = tail[0];
    modifierValue = Number(tail.slice(1));

    if (!Number.isInteger(modifierValue)) {
      return { ok: false, error: "Niepoprawny modyfikator." };
    }

    if (operator === "*" && modifierValue < 0) {
      return { ok: false, error: "Mnożnik nie może być ujemny." };
    }
  }

  return { ok: true, count, sides, operator, modifierValue };
}

function rollOnce(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rzut kośćmi np. k20, 2k20, 3k6+2")
    .addStringOption((option) =>
      option
        .setName("rzut")
        .setDescription("Wpisz rzut, np. k20 lub 2k20+5")
        .setRequired(true)
    ),

  async execute(interaction) {
    const now = Date.now();
    const last = rollCooldown.get(interaction.user.id) ?? 0;

    if (now - last < 3000) {
      return safeReply(interaction, { content: "Poczekaj chwilę." });
    }

    rollCooldown.set(interaction.user.id, now);

    const input = interaction.options.getString("rzut");
    if (!input) {
      return safeReply(interaction, {
        content: "Brak parametru. Użyj: /roll rzut: k20",
      });
    }

    const parsed = parseDiceExpr(input);
    if (!parsed.ok) {
      return safeReply(interaction, { content: parsed.error });
    }

    const { count, sides, operator, modifierValue } = parsed;

    const rolls = Array.from({ length: count }, () => rollOnce(sides));
    const baseSum = rolls.reduce((a, b) => a + b, 0);

    const finalResult = operator
      ? OPS[operator](baseSum, modifierValue)
      : baseSum;

    const expressionText =
      `${count}k${sides}` + (operator ? `${operator}${modifierValue}` : "");

    const resultLine = `${finalResult} <- [${rolls.join(", ")}] ${expressionText}`;

    return safeReply(interaction, {
      content: `${interaction.user} \`${resultLine}\``,
    });
  },
};