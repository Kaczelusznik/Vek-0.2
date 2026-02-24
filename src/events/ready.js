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

  // TWARDY TEST AI
  console.log("[AI] test start");
  try {
    const txt = await testAI();
    console.log("[AI] test ok:", txt);
  } catch (e) {
    console.error("[AI] test error:", e);
  }
  console.log("[AI] test end");

  // RP autopost
  try {
    await startRpScheduler(client);
  } catch (err) {
    console.error("[RP] Scheduler start error:", err);
  }
};