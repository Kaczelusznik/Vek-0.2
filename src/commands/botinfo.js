// src/commands/botinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Informacje techniczne o bocie VEK 0.2"),

  async execute(interaction) {
    const client = interaction.client;
    const uptime = process.uptime();

    const embed = new EmbedBuilder()
      .setTitle("VEK 0.2 — Status Systemu")
      .setColor(0x5e17eb)
      .addFields(
        {
          name: "System",
          value:
            `Node.js: ${process.version}\n` +
            `RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
            `Platforma: ${os.platform()}`,
          inline: true,
        },
        {
          name: "Połączenie",
          value: `Ping: ${client.ws.ping} ms`,
          inline: true,
        },
        {
          name: "Uptime",
          value: `${Math.floor(uptime / 86400)}d ${Math.floor((uptime % 86400) / 3600)}h ${Math.floor(
            (uptime % 3600) / 60
          )}m ${Math.floor(uptime % 60)}s`,
          inline: false,
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};