const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Info o graczu")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("O kim?").setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const created = Math.floor(user.createdTimestamp / 1000);
    const joined = member ? Math.floor(member.joinedTimestamp / 1000) : null;

    const roles = member
      ? member.roles.cache
          .filter((r) => r.id !== interaction.guild.id)
          .map((r) => r.toString())
          .slice(0, 20)
      : [];

    const embed = new EmbedBuilder()
      .setTitle(`User info: ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "ID", value: user.id, inline: true },
        { name: "Konto utworzone", value: `<t:${created}:F>`, inline: true },
        { name: "Dołączył na serwer", value: joined ? `<t:${joined}:F>` : "—", inline: true },
        { name: "Role", value: roles.length ? roles.join(" ") : "—", inline: false }
      );

    return interaction.reply({ embeds: [embed] });
  },
};