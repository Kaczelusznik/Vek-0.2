const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("duck")
    .setDescription("Wyświetla kaczuche 🦆"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🦆 Kaczka dla Ciebie")
      .setDescription(`Specjalna kaczka dla ${interaction.user.username}`)
      .setImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA9sCaeYxCJ6uU68IdZWXLX317wJCwcr98SG9RoId0h1qSK2saHQhOWiP4oTgBi65K88FitEJMkMf7yWbMs_s2CAsnv5o4ojAps5wGEg&s=10")
      .setColor(0xFFD700)
      .setFooter({ text: "VEK 0.2 • Duck Protocol" });

    await interaction.reply({ embeds: [embed] });
  },
};