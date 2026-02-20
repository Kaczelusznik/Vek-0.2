// scripts/clear-guild.js
require("dotenv").config();
const { REST, Routes } = require("discord.js");

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    if (!process.env.CLIENT_ID) throw new Error("Brak CLIENT_ID w .env");
    if (!process.env.GUILD_ID) throw new Error("Brak GUILD_ID w .env");

    console.log("Czyszczenie GUILD komend...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: [] }
    );

    console.log("OK: guild komendy usunięte.");
  } catch (err) {
    console.error("FAILED:", err);
    process.exit(1);
  }
})();