const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Pokazuje avatar gracza")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("Czyj avatar?").setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const url = user.displayAvatarURL({ size: 1024 });

    const embed = new EmbedBuilder()
      .setTitle(`Avatar: ${user.username}`)
      .setImage(url);

    return interaction.reply({ embeds: [embed] });
  },
};