// src/events/interactionCreate.js
const NEED_DEFER = new Set(["addmoney", "removemoney", "leaderboard"]);

module.exports = async (interaction, client) => {
  if (!interaction?.isChatInputCommand?.()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    if (NEED_DEFER.has(interaction.commandName)) {
      await interaction.deferReply({ ephemeral: true });
    }

    await command.execute(interaction);
  } catch (error) {
    console.error("interactionCreate error:", error);

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: "Wystąpił błąd." }).catch(() => {});
    } else {
      await interaction.reply({ content: "Wystąpił błąd.", ephemeral: true }).catch(() => {});
    }
  }
};