// src/events/interactionCreate.js
module.exports = async (client, interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction);
  } catch (err) {
    console.error("interactionCreate error:", err);

    // Jeśli komenda już odpowiedziała albo zrobiła defer — nie wolno reply drugi raz
    if (interaction.deferred || interaction.replied) {
      return interaction.followUp({
        content: "❌ Wystąpił błąd podczas wykonywania komendy.",
        flags: 64, // ephemeral
      });
    }

    return interaction.reply({
      content: "❌ Wystąpił błąd podczas wykonywania komendy.",
      flags: 64, // ephemeral
    });
  }
};
