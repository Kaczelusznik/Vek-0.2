// src/events/ready.js
const { startRpScheduler } = require("../rpScheduler");
const { testAI } = require("../ai");

module.exports = async (client) => {
  console.log(`Zalogowano jako ${client.user.tag}`);
  console.log("APPLICATION ID:", client.application?.id);

  client.user.setPresence({
    activities: [{ name: "Składa nezecki taboret", type: 0 }],
    status: "online",
  });

  console.log("Has OPENAI_API_KEY:", Boolean(process.env.OPENAI_API_KEY));

  // TEST AI (na razie tylko log do konsoli)
  try {
    const txt = await testAI();
    console.log("AI TEST:", txt);
  } catch (e) {
    console.error("AI TEST ERROR:", e);
  }

  // RP autopost (bez komend) — start po zalogowaniu
  try {
    await startRpScheduler(client);
  } catch (err) {
    console.error("[RP] Scheduler start error:", err);
  }
};