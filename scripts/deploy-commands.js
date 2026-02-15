require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Sprawdza czy bot żyje")
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Rejestruję komendy...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("Gotowe.");
  } catch (error) {
    console.error(error);
  }
})();
