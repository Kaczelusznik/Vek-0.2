const { SlashCommandBuilder } = require('discord.js');
const { removeMoney } = require('../db');

const ALLOWED_ROLES = [
  '【♔ Moderator ♔ 】',
  '【 ♘ Mistrz Gry ♘】',
  '【♕ Administrator ♕】',
  'Imperator'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removemoney')
    .setDescription('Zabierz monety graczowi')
    .addUserOption(opt =>
      opt.setName('gracz')
        .setDescription('Komu zabrać?')
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('kwota')
        .setDescription('Ile zabrać?')
        .setMinValue(1)
        .setRequired(true)
    )
    .addBooleanOption(opt =>
      opt.setName('moze_ujemne')
        .setDescription('Czy saldo może spaść poniżej 0?')
    ),

  async execute(interaction) {
    if (!interaction.member?.roles?.cache.some(r => ALLOWED_ROLES.includes(r.name))) {
      return interaction.editReply({ content: 'Nie masz uprawnień.' });
    }

    try {
      const target = interaction.options.getUser('gracz', true);
      const amount = interaction.options.getInteger('kwota', true);
      const allowNegative = interaction.options.getBoolean('moze_ujemne') ?? false;

      const res = await removeMoney(
        interaction.guildId,
        target.id,
        amount,
        { allowNegative }
      );

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
