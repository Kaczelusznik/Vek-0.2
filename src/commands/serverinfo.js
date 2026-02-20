const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Info o serwerze"),

  async execute(interaction) {
    const g = interaction.guild;

    const owner = await g.fetchOwner().catch(() => null);
    const created = Math.floor(g.createdTimestamp / 1000);

    const embed = new EmbedBuilder()
      .setTitle(`Server info: ${g.name}`)
      .setThumbnail(g.iconURL({ size: 256 }))
      .addFields(
        { name: "ID", value: g.id, inline: true },
        { name: "Owner", value: owner ? owner.user.tag : "—", inline: true },
        { name: "Utworzony", value: `<t:${created}:F>`, inline: true },
        { name: "Liczba członków", value: String(g.memberCount ?? "—"), inline: true },
        { name: "Liczba kanałów", value: String(g.channels.cache.size), inline: true },
        { name: "Boost level", value: String(g.premiumTier), inline: true }
      );

    return interaction.reply({ embeds: [embed] });
  },
};