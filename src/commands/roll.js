const { SlashCommandBuilder } = require("discord.js");

const rollCooldown = new Map();

function parseDiceExpr(input) {
  const raw = String(input ?? "").trim().replace(/\s+/g, "");

  const m = raw.match(/^(\d+)[kKdD](\d+)([+\-*]\d+)?$/);

  if (!m) {
    return { ok: false, error: "Format: 2K20, 2K20+5, 2K20*2" };
  }

  const count = Number(m[1]);
  const sides = Number(m[2]);
  const tail = m[3] || null;

  if (count < 1 || count > 50)
    return { ok: false, error: "Liczba kości 1-50." };

  if (sides < 2 || sides > 10000)
    return { ok: false, error: "Kość 2-10000 ścian." };

  let operator = null;
  let modifier = 0;

  if (tail) {
    operator = tail[0];
    modifier = Number(tail.slice(1));
  }

  return { ok: true, raw, count, sides, operator, modifier };
}

function rollOnce(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rzut kośćmi np. 2K20+5")
    .addStringOption(option =>
      option
        .setName("expr")
        .setDescription("Wyrażenie rzutu")
        .setRequired(true)
    ),

  async execute(interaction) {

    // cooldown 3s
    const now = Date.now();
    const last = rollCooldown.get(interaction.user.id) ?? 0;

    if (now - last < 3000) {
      return interaction.reply({
        content: "Poczekaj chwilę.",
        ephemeral: true
      });
    }

    rollCooldown.set(interaction.user.id, now);

    const expr = interaction.options.getString("expr");
    const parsed = parseDiceExpr(expr);

    if (!parsed.ok) {
      return interaction.reply({ content: parsed.error, ephemeral: true });
    }

    const { raw, count, sides, operator, modifier } = parsed;

    const rolls = [];
    for (let i = 0; i < count; i++) {
      rolls.push(rollOnce(sides));
    }

    const baseSum = rolls.reduce((a, b) => a + b, 0);

    let result = baseSum;

    if (operator === "+") result += modifier;
    if (operator === "-") result -= modifier;
    if (operator === "*") result *= modifier;

    // Format jak na screenie:
    // 188 ⟵ [172, 11] 2d400 + 5

    let expressionText = `${count}d${sides}`;

    if (operator === "+") expressionText += ` + ${modifier}`;
    if (operator === "-") expressionText += ` - ${modifier}`;
    if (operator === "*") expressionText += ` * ${modifier}`;

    const output = `**${result}** ⟵ [${rolls.join(", ")}] ${expressionText}`;
    await interaction.reply(`${interaction.user} ${output}`);

    await interaction.reply(output);
  }
};
