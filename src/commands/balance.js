const { SlashCommandBuilder } = require("discord.js");
const { getBalance } = require("../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Pokazuje saldo")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("Czyje saldo?").setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const bal = await getBalance(user.id);

    return interaction.reply({
      content: `<:hajs:1475527687945851060> Saldo ${user.username}: **${bal}** monet`,
    });
  },
};