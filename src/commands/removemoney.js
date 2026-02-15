const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { removeMoney } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removemoney')
    .setDescription('ADMIN: zabierz monety graczowi')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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
    ),

  async execute(interaction) {
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
