// src/events/ready.js
const { startRpScheduler } = require("../rpScheduler");

module.exports = async (client) => {
  console.log(`Zalogowano jako ${client.user.tag}`);
  console.log("APPLICATION ID:", client.application?.id);

  client.user.setPresence({
    activities: [{ name: "Składa nezecki taboret", type: 0 }],
    status: "online",
  });

  // SPRAWDZENIE CZY AI KLUCZ JEST
  console.log("Has OPENAI_API_KEY:", Boolean(process.env.OPENAI_API_KEY));

  // RP autopost (bez komend) — start po zalogowaniu
  try {
    await startRpScheduler(client);
  } catch (err) {
    console.error("[RP] Scheduler start error:", err);
  }
};