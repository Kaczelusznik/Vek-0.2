const { SlashCommandBuilder } = require("discord.js");

async function safeReply(interaction, payload) {
  if (interaction.deferred || interaction.replied) {
    return interaction.followUp(payload);
  }
  return interaction.reply(payload);
}

const rollCooldown = new Map();

function parseDiceExpr(input) {
  const raw = String(input ?? "").trim().replace(/\s+/g, "");

  // 2k20, 2K20, 2k20+5, 2k20-3, 2k20*2
  const m = raw.match(/^(\d+)[kK](\d+)([+\-*]\d+)?$/);
  if (!m) {
    return { ok: false, error: "Format: 2k20, 2k20+5, 2k20*2" };
  }

  const count = Number(m[1]);
  const sides = Number(m[2]);
  const tail = m[3] || null;

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
    operator = tail[0]; // + - *
    modifierValue = Number(tail.slice(1));
    if (!Number.isInteger(modifierValue)) {
      return { ok: false, error: "Niepoprawny modyfikator." };
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
    .setDescription("Rzut kośćmi np. 2k20, 3k6+2")
    // NOWA nazwa opcji:
    .addStringOption((option) =>
      option
        .setName("rzut")
        .setDescription("Wpisz rzut, np. 2k20")
        .setRequired(true)
    ),

  async execute(interaction) {
    // cooldown 3 sekundy
    const now = Date.now();
    const last = rollCooldown.get(interaction.user.id) ?? 0;

    if (now - last < 3000) {
      return safeReply(interaction, {
        content: "Poczekaj chwilę.",
        ephemeral: true,
      });
    }
    rollCooldown.set(interaction.user.id, now);

    // KOMPATYBILNOŚĆ: działa i dla nowego "rzut", i starego "expr"
    const input =
      interaction.options.getString("rzut") ??
      interaction.options.getString("expr");

    if (!input) {
      return safeReply(interaction, {
        content: "Brak parametru. Użyj: /roll rzut: 2k20",
        ephemeral: true,
      });
    }

    const parsed = parseDiceExpr(input);
    if (!parsed.ok) {
      return safeReply(interaction, {
        content: parsed.error,
        ephemeral: true,
      });
    }

    const { count, sides, operator, modifierValue } = parsed;

    const rolls = [];
    for (let i = 0; i < count; i++) rolls.push(rollOnce(sides));

    const baseSum = rolls.reduce((a, b) => a + b, 0);

    let finalResult = baseSum;
    if (operator === "+") finalResult += modifierValue;
    if (operator === "-") finalResult -= modifierValue;
    if (operator === "*") finalResult *= modifierValue;

    // Format jak chcesz: "36 ⟵ [17, 19] 2k20"
    let expressionText = `${count}k${sides}`;
    if (operator === "+") expressionText += `+${modifierValue}`;
    if (operator === "-") expressionText += `-${modifierValue}`;
    if (operator === "*") expressionText += `*${modifierValue}`;

    const oneLine = `${finalResult} ⟵ [${rolls.join(", ")}] ${expressionText}`;

    return safeReply(interaction, {
      content: `${interaction.user} \`${oneLine}\``,
    });
  },
};
