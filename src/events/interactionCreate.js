// src/events/interactionCreate.js

// src/events/interactionCreate.js
const { upsertRpVote } = require("../db");

module.exports = async (interaction, client) => {
  // 1) BUTTONS: RP VOTE
  if (interaction.isButton()) {
    const id = String(interaction.customId || "");

    if (id.startsWith("rpvote:")) {
      try {
        const parts = id.split(":");
        const sceneId = Number(parts[1]);
        const optionKey = parts[2];

        if (!Number.isInteger(sceneId) || !optionKey) {
          return interaction.reply({ content: "Błędny głos.", ephemeral: true });
        }

        await upsertRpVote(sceneId, interaction.user.id, optionKey);
        return interaction.reply({ content: `Oddano głos: ${optionKey}`, ephemeral: true });
      } catch (e) {
        console.error("[RP] vote error:", e);
        if (!interaction.replied && !interaction.deferred) {
          return interaction.reply({ content: "Nie udało się zapisać głosu.", ephemeral: true });
        }
        return;
      }
    }

    // jeśli to inny button, niech leci dalej do reszty Twojej logiki
  }

  // 2) TU DOPIERO Twoja obecna obsługa slash commands
  // (zostaw jak masz)
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