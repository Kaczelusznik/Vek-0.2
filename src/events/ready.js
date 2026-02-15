module.exports = (client) => {
  console.log(`Zalogowano jako ${client.user.tag}`);
  console.log("LOGGED AS:", client.user.tag);
  console.log("APPLICATION ID:", client.application.id);
  console.log(`Zalogowano jako ${client.user.tag}`);

  client.user.setPresence({
    activities: [
      {
        name: "Składa nezecki taboret",
        type: 1, // Playing
      },
    ],
    status: "online",
  });
};
