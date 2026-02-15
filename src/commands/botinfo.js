// src/commands/botinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Informacje o bocie VEK 0.2"),

  async execute(interaction) {
    const client = interaction.client;

    const uptime = process.uptime(); // sekundy
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const embed = new EmbedBuilder()
      .setTitle("VEK 0.2 — Informacje")
      .setColor(0x2b2d31)
      .addFields(
        {
          name: "📦 Wersja",
          value: "VEK 0.2",
          inline: true,
        },
        {
          name: "📡 Ping",
          value: `${client.ws.ping} ms`,
          inline: true,
        },
        {
          name: "⏱ Uptime",
          value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          inline: true,
        },
        {
          name: "🌍 Serwery",
          value: `${client.guilds.cache.size}`,
          inline: true,
        },
        {
          name: "👥 Użytkownicy",
          value: `${client.users.cache.size}`,
          inline: true,
        },
        {
          name: "🖥 Node.js",
          value: `${process.version}`,
          inline: true,
        }
      )
      .setFooter({ text: "Bot serwerowy • Ekonomia • Levele • Roll" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
