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

    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const secs = Math.floor(uptime % 60);

    const embed = new EmbedBuilder()
      .setTitle("⚙️ VEK 0.2 — Status Systemu")
      .setColor(0x5e17eb)
      .addFields(
        {
          name: "🧠 System",
          value:
            `Node.js: ${process.version}\n` +
            `RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
            `Platforma: ${os.platform()}`,
          inline: true,
        },
        {
          name: "📡 Połączenie",
          value:
            `Ping: ${client.ws.ping} ms\n` +
            `Shard: ${client.shard?.ids?.[0] ?? 0}`,
          inline: true,
        },
        {
          name: "🌍 Statystyki",
          value:
            `Serwery: ${client.guilds.cache.size}\n` +
            `Użytkownicy: ${client.users.cache.size}\n` +
            `Kanały: ${client.channels.cache.size}`,
          inline: true,
        },
        {
          name: "⏱ Uptime",
          value: `${days}d ${hours}h ${mins}m ${secs}s`,
          inline: false,
        }
      )
      .setFooter({ text: "VEK • System ekonomii • Roll • Poziomy" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] }); // PUBLICZNE
  },
};