require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const ready = require("./events/ready");
const interactionCreate = require("./events/interactionCreate");
const ping = require("./commands/ping");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.commands.set(ping.data.name, ping);

client.once("ready", () => ready(client));
client.on("interactionCreate", (i) => interactionCreate(client, i));

client.login(process.env.DISCORD_TOKEN);
