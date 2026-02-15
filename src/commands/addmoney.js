const { SlashCommandBuilder } = require('discord.js');
const { addMoney } = require('../db');

const ALLOWED_ROLES = ['【♔ Moderator ♔ 】', '【 ♘ Mistrz Gry ♘】', '【♕ Administrator ♕】', 'Imperator'];

function hasAllowedRole(interaction) {
  const member = interaction.member;
  if (!member || !member.roles) return false;

  return member.roles.cache.some(role => ALLOWED_ROLES.includes(role.name));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Komendy administracyjne: dodawanie')
    .addSubcommand(sub =>
      sub
        .setName('money')
        .setDescription('Dodaj monety graczowi (Moderator/MG/Admin/Imperator)')
        .addUserOption(opt =>
          opt.setName('gracz').setDescription('Komu dodać?').setRequired(true)
        )
        .addIntegerOption(opt =>
          opt.setName('kwota').setDescription('Ile dodać?').setRequired(true).setMinValue(1)
        )
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() !== 'money') {
      return interaction.reply({ content: 'Nieznana subkomenda.', ephemeral: true });
    }

    if (!hasAllowedRole(interaction)) {
      return interaction.reply({
        content: 'Nie masz uprawnień nikczemniku. Wymagana rola: Moderator / Mistrz Gry / Administrator / Imperator.',
        ephemeral: true,
      });
    }

    const target = interaction.options.getUser('gracz', true);
    const amount = interaction.options.getInteger('kwota', true);

    const guildId = interaction.guildId;
    const newBal = addMoney(guildId, target.id, amount);
    const prevBal = newBal - amount;

    return interaction.reply({
      content: `Dodano **${amount}** monet dla ${target}. Saldo: **${prevBal} → ${newBal}**`,
      allowedMentions: { users: [target.id] },
    });
  },
};
