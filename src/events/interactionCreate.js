// src/events/interactionCreate.js

const { upsertRpVote } = require("../db");

module.exports = async (interaction) => {
  try {
    if (interaction.isButton()) {
      const id = interaction.customId || "";
      if (id.startsWith("rpvote:")) {
        const [, sceneIdRaw, optionKey] = id.split(":");
        const sceneId = Number(sceneIdRaw);

        if (!Number.isInteger(sceneId) || !optionKey) {
          return interaction.reply({ content: "Błędny głos.", ephemeral: true });
        }

        await upsertRpVote(sceneId, interaction.user.id, optionKey);
        return interaction.reply({ content: `Oddano głos: ${optionKey}`, ephemeral: true });
      }
    }

    // tu zostawiasz swoją obecną obsługę komend slash
  } catch (e) {
    console.error("interactionCreate error:", e);
    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({ content: "Wystąpił błąd.", ephemeral: true });
      } catch {}
    }
  }
};

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