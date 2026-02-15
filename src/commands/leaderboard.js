const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { topBalances } = require('../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Top bogaczy na serwerze')
    .addIntegerOption(opt =>
      opt.setName('limit')
        .setDescription('Ile pozycji? (1-20)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(20)
    ),

  async execute(interaction) {
    const limit = interaction.options.getInteger('limit') ?? 10;
    const guildId = interaction.guildId;

    try {
      const rows = await topBalances(guildId, limit);

      const lines = rows.length
        ? rows.map((r, i) => `**${i + 1}.** <@${r.user_id}> — **${r.balance}** 💰`).join('\n')
        : 'Brak danych.';

      const embed = new EmbedBuilder()
        .setTitle('🏆 Leaderboard - monety')
        .setDescription(lines)
        .setFooter({ text: `VEK 0.2 • Top ${limit}` })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      return interaction.editReply({
        content: `Błąd: ${err.message}`,
      });
    }
  },
};
