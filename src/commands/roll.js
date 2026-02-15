async function safeReply(interaction, payload) {
  if (interaction.deferred || interaction.replied) {
    return interaction.followUp(payload);
  }
  return interaction.reply(payload);
}


const { SlashCommandBuilder } = require('discord.js');

const rollCooldown = new Map();

function parseDiceExpr(input) {
  const raw = String(input ?? '').trim().replace(/\s+/g, '');

  // Obsługuje:
  // 2K20
  // 2K20+5
  // 2K20-3
  // 2K20*2
  const m = raw.match(/^(\d+)[kK](\d+)([+\-*]\d+)?$/);

  if (!m) {
    return { ok: false, error: 'Zły format. Użyj np. 2K20, 2K20+5, 2K20*2' };
  }

  const count = Number(m[1]);
  const sides = Number(m[2]);
  const modifierRaw = m[3] || null;

  if (count < 1 || count > 50)
    return { ok: false, error: 'Liczba kości musi być 1..50.' };

  if (sides < 2 || sides > 1000)
    return { ok: false, error: 'Kość musi mieć 2..1000 ścian.' };

  let operator = null;
  let modifierValue = 0;

  if (modifierRaw) {
    operator = modifierRaw[0]; // + - *
    modifierValue = Number(modifierRaw.slice(1));
  }

  return {
    ok: true,
    raw,
    count,
    sides,
    operator,
    modifierValue
  };
}

function rollOnce(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rzut kośćmi np. 2K20+5, 3k6*2')
    .addStringOption(option =>
      option
        .setName('expr')
        .setDescription('Wyrażenie rzutu')
        .setRequired(true)
    ),

  async execute(interaction) {

    // Cooldown 3 sekundy
    const now = Date.now();
    const last = rollCooldown.get(interaction.user.id) ?? 0;

    if (now - last < 3000) {
      return safeReply(interaction, {
        content: 'Poczekaj chwilę przed kolejnym rzutem.',
        ephemeral: true
      });
    }



    rollCooldown.set(interaction.user.id, now);

    const expr = interaction.options.getString('expr');
    const parsed = parseDiceExpr(expr);

    if (!parsed.ok) {
      return safeReply(interaction, {
        content: parsed.error,
        ephemeral: true
      });
    }


    const { raw, count, sides, operator, modifierValue } = parsed;

    const rolls = [];

    for (let i = 0; i < count; i++) {
      rolls.push(rollOnce(sides));
    }

    const baseSum = rolls.reduce((a, b) => a + b, 0);

    let expressionText = `${count}d${sides}`;
    if (operator === '+') expressionText += ` + ${modifierValue}`;
    if (operator === '-') expressionText += ` - ${modifierValue}`;
    if (operator === '*') expressionText += ` * ${modifierValue}`;

    const oneLine = `${finalResult} ⟵ [${rolls.join(', ')}] ${expressionText}`;
    return safeReply(interaction, { content: `${interaction.user} \`${oneLine}\`` });
  }
};
