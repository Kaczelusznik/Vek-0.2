// src/events/interactionCreate.js
const { upsertRpVote } = require("../db");

const NEED_DEFER = new Set(["addmoney", "removemoney", "leaderboard"]);

module.exports = async (interaction, client) => {
  // =========================
  // 1) RP VOTE BUTTONS
  // =========================
  if (interaction?.isButton?.()) {
    const id = String(interaction.customId || "");

    if (id.startsWith("rpvote:")) {
      // odpowiadamy od razu, żeby nie było "Ta czynność się nie powiodła"
      try {
        await interaction.deferReply({ ephemeral: true });
      } catch {}

      try {
        const [, sceneIdRaw, optionKey] = id.split(":");
        const sceneId = Number(sceneIdRaw);

        if (!Number.isInteger(sceneId) || !optionKey) {
          return interaction.editReply({ content: "Błędny głos." });
        }

        await upsertRpVote(sceneId, interaction.user.id, optionKey);
        return interaction.editReply({ content: `Oddano głos: **${optionKey}**` });
      } catch (e) {
        console.error("[RP] vote error:", e);
        return interaction.editReply({ content: "Nie udało się zapisać głosu." });
      }
    }

    // jeśli to nie nasz button, nie rób nic
    return;
  }

  // =========================
  // 2) SLASH COMMANDS (Twoje)
  // =========================
  if (!interaction?.isChatInputCommand?.()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    if (NEED_DEFER.has(interaction.commandName)) {
      await interaction.deferReply(); // PUBLICZNE
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