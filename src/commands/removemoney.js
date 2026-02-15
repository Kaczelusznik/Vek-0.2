const { SlashCommandBuilder } = require('discord.js');
const { removeMoney } = require('../db');

const ALLOWED_ROLES = ['【♔ Moderator ♔ 】', '【 ♘ Mistrz Gry ♘】', '【♕ Administrator ♕】', 'Imperator'];

function hasAllowedRole(interaction) {
  const member = interaction.member;
  if (!member || !member.roles) return false;
  return member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.name));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removemoney')
    .setDescription('Zabierz monety graczowi')
    .addUserOption(opt =>
      opt.setName('gracz').setDescription('Komu zabrać?').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('kwota').setDescription('Ile zabrać?').setRequired(true).setMinValue(1)
    )
    .addBooleanOption(opt =>
      opt.setName('moze_ujemne')
        .setDescription('Czy saldo może spaść poniżej 0?')
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!hasAllowedRole(interaction)) {
      return interaction.editReply({
        content: 'Nie masz uprawnień.',
      });
    }

    const target = interaction.options.getUser('gracz', true);
    const amount = interaction.options.getInteger('kwota', true);
    const allowNegative = interaction.options.getBoolean('moze_ujemne') ?? false;
    const guildId = interaction.guildId;

    try {
      const res = await removeMoney(guildId, target.id, amount, { allowNegative });

      if (!res.ok) {
        return interaction.editReply({
          content: `${target} ma tylko **${res.current}** monet.`,
          allowedMentions: { users: [target.id] },
        });
      }

      return interaction.editReply({
        content: `Zabrano **${amount}** monet ${target}. Saldo: **${res.current} → ${res.next}**`,
        allowedMentions: { users: [target.id] },
      });
    } catch (err) {
      return interaction.editReply({
        content: `Błąd: ${err.message}`,
      });
    }
  },
};
