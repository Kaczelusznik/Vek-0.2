// src/events/ready.js
module.exports = (client) => {
  console.log(`Zalogowano jako ${client.user.tag}`);
  console.log("APPLICATION ID:", client.application?.id);

  client.user.setPresence({
    activities: [{ name: "Składa nezecki taboret", type: 0 }],
    status: "online",
  });
};