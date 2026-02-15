require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const ready = require("./events/ready");
const interactionCreate = require("./events/interactionCreate");
const ping = require("./commands/ping");

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});

console.log("Booting bot...");
console.log("Node:", process.version);
console.log("Has DISCORD_TOKEN:", Boolean(process.env.DISCORD_TOKEN));
console.log("Token length:", process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.length : 0);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on("error", (err) => console.error("client error:", err));
client.on("warn", (msg) => console.warn("client warn:", msg));

client.commands = new Collection();
client.commands.set(ping.data.name, ping);

// ✅ TO JEST KLUCZ:
client.once("ready", () => ready(client));

client.on("interactionCreate", (i) => interactionCreate(client, i));
client.on("interactionCreate", (i) => {
  console.log("INTERACTION:", i.commandName);
});


client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error("LOGIN FAILED:", err);
  process.exit(1);
});
