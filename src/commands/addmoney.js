const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addMoney, getBalance } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addmoney')
    .setDescription('ADMIN: dodaj monety graczowi')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(opt =>
      opt.setName('gracz').setDescription('Komu dodać?').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('kwota').setDescription('Ile dodać?').setRequired(true).setMinValue(1)
    ),

  async execute(interaction) {
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
