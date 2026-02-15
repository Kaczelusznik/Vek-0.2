const { SlashCommandBuilder } = require('discord.js');
const { addMoney } = require('../db');

const ALLOWED_ROLES = ['【♔ Moderator ♔ 】', '【 ♘ Mistrz Gry ♘】', '【♕ Administrator ♕】', 'Imperator'];

function hasAllowedRole(interaction) {
  const member = interaction.member;
  if (!member || !member.roles) return false;
  return member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.name));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addmoney')
    .setDescription('Dodaj monety graczowi')
    .addUserOption(opt =>
      opt.setName('gracz').setDescription('Komu dodać?').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('kwota').setDescription('Ile dodać?').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
    if (!hasAllowedRole(interaction)) {
      return interaction.editReply({
        content: 'Nie masz uprawnień.',
      });
    }

    const target = interaction.options.getUser('gracz', true);
    const amount = interaction.options.getInteger('kwota', true);
    const guildId = interaction.guildId;

    try {
      const newBal = await addMoney(guildId, target.id, amount);
      const prevBal = newBal - amount;

      return interaction.editReply({
        content: `Dodano **${amount}** monet dla ${target}. Saldo: **${prevBal} → ${newBal}**`,
        allowedMentions: { users: [target.id] },
      });
    } catch (err) {
      return interaction.editReply({
        content: `Błąd: ${err.message}`,
      });
    }
  },
};
