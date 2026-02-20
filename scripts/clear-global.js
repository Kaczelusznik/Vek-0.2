require("dotenv").config();
const { REST, Routes } = require("discord.js");

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    if (!process.env.CLIENT_ID) throw new Error("Brak CLIENT_ID w .env");

    console.log("Czyszczenie GLOBALNYCH komend (tylko tej aplikacji)...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
    console.log("OK: globalne komendy usunięte.");
  } catch (err) {
    console.error("FAILED:", err);
    process.exit(1);
  }
})();