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

// po zebraniu commands[]
const names = commands.map(c => c.name);
const counts = names.reduce((acc, n) => (acc[n] = (acc[n] || 0) + 1, acc), {});
const dups = Object.entries(counts).filter(([, v]) => v > 1);

if (dups.length) {
  console.log("DUPLICATE COMMAND NAMES FOUND:");
  for (const [name, count] of dups) {
    console.log(` - ${name}: ${count}x`);
  }

  // pokaż z jakimi opisami
  for (const name of dups.map(([n]) => n)) {
    console.log(`\nDescriptions for "${name}":`);
    for (const cmd of commands.filter(c => c.name === name)) {
      console.log(` - ${cmd.description}`);
    }
  }

  throw new Error("Masz duplikaty .setName(...) w src/commands. Usuń/zmień jeden plik.");
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