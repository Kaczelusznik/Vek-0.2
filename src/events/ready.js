module.exports = (client) => {
  console.log(`Zalogowano jako ${client.user.tag}`);
  console.log("LOGGED AS:", client.user.tag);
  console.log("APPLICATION ID:", client.application.id);

};
