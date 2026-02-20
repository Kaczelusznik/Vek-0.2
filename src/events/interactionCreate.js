module.exports = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    // 🔥 ZAWSZE deferujemy tutaj — raz globalnie
    await interaction.deferReply({ ephemeral: true });

    // Uruchamiamy komendę
    await command.execute(interaction);

  } catch (error) {
    console.error("interactionCreate error:", error);

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: "❌ Wystąpił błąd." }).catch(() => {});
    } else {
      await interaction.reply({ content: "❌ Wystąpił błąd.", ephemeral: true }).catch(() => {});
    }
  }
};