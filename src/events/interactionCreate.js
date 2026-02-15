module.exports = async (client, interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;

    await cmd.execute(interaction);
  } catch (err) {
    console.error("interactionCreate error:", err);

    const msg = { content: "Błąd przy wykonaniu komendy.", ephemeral: true };

    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(msg).catch(() => {});
    } else {
      await interaction.reply(msg).catch(() => {});
    }
  }
};
