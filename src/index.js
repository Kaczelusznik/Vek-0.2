require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

process.on("unhandledRejection", (err) => console.error("unhandledRejection:", err));
process.on("uncaughtException", (err) => console.error("uncaughtException:", err));

console.log("Booting bot...");
console.log("Node:", process.version);
console.log("Has DISCORD_TOKEN:", Boolean(process.env.DISCORD_TOKEN));
console.log("Token length:", process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.length : 0);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on("error", (err) => console.error("client error:", err));
client.on("warn", (msg) => console.warn("client warn:", msg));
client.on('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) {
      return interaction.reply({ content: 'Brak handlera dla tej komendy.', ephemeral: true });
    }

    // daje Ci czas na DB / logikę, nie będzie "nie reaguje"
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: false });
    }

    await cmd.execute(interaction);
  } catch (err) {
    console.error('interactionCreate error:', err);

    // jeśli już było deferReply, kończymy editReply
    if (interaction.deferred && !interaction.replied) {
      return interaction.editReply({ content: 'Wewnętrzny błąd bota. Sprawdź logi w konsoli.' });
    }

    // jeśli jeszcze nie odpowiedział
    if (!interaction.replied) {
      return interaction.reply({ content: 'Wewnętrzny błąd bota. Sprawdź logi w konsoli.', ephemeral: true });
    }
  }
});




/* ===== KOMENDY: src/commands/*.js ===== */
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.existsSync(commandsPath)
  ? fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"))
  : [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if (!command?.data?.name || typeof command.execute !== "function") {
    console.warn(`[commands] Skip ${file} (brak data.name albo execute)`);
    continue;
  }

  client.commands.set(command.data.name, command);
  console.log("[commands] Loaded:", command.data.name);
}

/* ===== EVENTY: src/events/*.js (nazwa pliku = nazwa eventu) ===== */
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.existsSync(eventsPath)
  ? fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"))
  : [];

for (const file of eventFiles) {
  const eventName = path.parse(file).name; // ready, interactionCreate, itp.
  const handler = require(path.join(eventsPath, file));

  if (typeof handler !== "function") {
    console.warn(`[events] Skip ${file} (export nie jest funkcją)`);
    continue;
  }

  if (eventName === "ready") {
    client.once("ready", (...args) => handler(client, ...args));
    console.log("[events] Bound once:", eventName);
  } else {
    client.on(eventName, (...args) => handler(client, ...args));
    console.log("[events] Bound:", eventName);
  }
}

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.log("ENV CLIENT_ID:", process.env.CLIENT_ID);
  console.error("LOGIN FAILED:", err);
  process.exit(1);
});
