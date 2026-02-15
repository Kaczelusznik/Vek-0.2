require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token) {
  console.error("Brak DISCORD_TOKEN w .env");
  process.exit(1);
}
if (!clientId) {
  console.error("Brak CLIENT_ID w .env");
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, "../src/commands");
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (!command?.data?.toJSON) {
    console.warn(`[deploy] Skip ${file} (brak data.toJSON)`);
    continue;
  }
  commands.push(command.data.toJSON());
  console.log("[deploy] Loaded:", command.data.name);
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Rejestracja komend...");

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log("Komendy zarejestrowane.");
  } catch (error) {
    console.error(error);
  }
})();
