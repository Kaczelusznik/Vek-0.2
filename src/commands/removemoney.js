const { SlashCommandBuilder } = require('discord.js');
const { removeMoney } = require('../db');

const ALLOWED_ROLES = ['【♔ Moderator ♔ 】', '【 ♘ Mistrz Gry ♘】', '【♕ Administrator ♕】', 'Imperator'];
function hasAllowedRole(interaction) {
  const member = interaction.member;
  if (!member || !member.roles) return false;

  return member.roles.cache.some(role => ALLOWED_ROLES.includes(role.name));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Komendy administracyjne: zabieranie')
    .addSubcommand(sub =>
      sub
        .setName('money')
        .setDescription('Zabierz monety graczowi (Moderator/MG/Admin/Imperator)')
        .addUserOption(opt =>
          opt.setName('gracz').setDescription('Komu zabrać?').setRequired(true)
        )
        .addIntegerOption(opt =>
          opt.setName('kwota').setDescription('Ile zabrać?').setRequired(true).setMinValue(1)
        )
        .addBooleanOption(opt =>
          opt.setName('moze_ujemne')
            .setDescription('Czy saldo może spaść poniżej 0? (domyślnie NIE)')
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() !== 'money') {
      return interaction.reply({ content: 'Nieznana subkomenda.', ephemeral: true });
    }

    if (!hasAllowedRole(interaction)) {
      return interaction.reply({
        content: 'Nie masz uprawnień plebsie. Wymagana rola: Moderator / Mistrz Gry / Administrator / Imperator.',
        ephemeral: true,
      });
    }

    const target = interaction.options.getUser('gracz', true);
    const amount = interaction.options.getInteger('kwota', true);
    const allowNegative = interaction.options.getBoolean('moze_ujemne') ?? false;

    const guildId = interaction.guildId;
    const res = removeMoney(guildId, target.id, amount, { allowNegative });

    if (!res.ok) {
      return interaction.reply({
        content: `${target} ma tylko **${res.current}** monet. Nie mogę zabrać **${amount}** (saldo nie może być ujemne).`,
        ephemeral: true,
        allowedMentions: { users: [target.id] },
      });
    }

    return interaction.reply({
      content: `Zabrano **${amount}** monet ${target}. Saldo: **${res.current} → ${res.next}**`,
      allowedMentions: { users: [target.id] },
    });
  },
};
