module.exports = async (client, interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) {
      return interaction.reply({
        content: 'Brak handlera dla tej komendy.',
        ephemeral: true
      });
    }

    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: false });
    }

    await cmd.execute(interaction);

  } catch (err) {
    console.error('interactionCreate error:', err);

    if (interaction.deferred && !interaction.replied) {
      return interaction.editReply({
        content: 'Wewnętrzny błąd bota. Sprawdź logi w konsoli.'
      });
    }

    if (!interaction.replied) {
      return interaction.reply({
        content: 'Wewnętrzny błąd bota. Sprawdź logi w konsoli.',
        ephemeral: true
      });
    }
  }
};
