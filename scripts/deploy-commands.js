// scripts/deploy-commands.js
require("dotenv").config();
process.env.DB_INIT = "0";

const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

const commands = [];

const commandsPath = path.join(__dirname, "..", "src", "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if (!command?.data?.toJSON || typeof command.execute !== "function") {
    console.warn(`[deploy] Skip ${file} (brak data albo execute)`);
    continue;
  }

  commands.push(command.data.toJSON());
  console.log("[deploy] Found:", command.data.name);
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    if (!process.env.CLIENT_ID) throw new Error("Brak CLIENT_ID w .env");
    if (!process.env.GUILD_ID) throw new Error("Brak GUILD_ID w .env");

    console.log(`Deploying ${commands.length} commands to guild ${process.env.GUILD_ID}...`);

    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
      body: commands,
    });

    console.log("Deploy OK");
  } catch (error) {
    console.error("Deploy FAILED:", error);
    process.exit(1);
  }
})();