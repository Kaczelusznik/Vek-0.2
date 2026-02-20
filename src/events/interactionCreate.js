// src/events/interactionCreate.js
const NEED_DEFER = new Set(["addmoney", "removemoney", "leaderboard"]);

module.exports = async (interaction, client) => {
  if (!interaction?.isChatInputCommand?.()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    // defer tylko dla komend, które potem używają editReply()
    if (NEED_DEFER.has(interaction.commandName)) {
      await interaction.deferReply(); // PUBLICZNE (bez ephemeral)
    }

    await command.execute(interaction);
  } catch (error) {
    console.error("interactionCreate error:", error);

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: "Wystąpił błąd." }).catch(() => {});
    } else {
      await interaction.reply({ content: "Wystąpił błąd." }).catch(() => {});
    }
  }
};