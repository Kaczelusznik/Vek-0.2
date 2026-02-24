const { ensureRpCampaign, getDueRpCampaigns, markRpCampaignRan } = require("./db");

function makeMarcelinaMessage(title) {
  const now = new Date().toLocaleString("pl-PL");
  return (
    `**[VEK] ${title}**\n` +
    `Cicho mówisz pod nosem "Potwór". Rozkaz Króla Anastazji nie zostawia miejsca na wahanie.\n` +
    `Marcelina von Skulszczit zaciska palce na paskach ekwipunku i rusza w stronę bramy. ${now}`
  );
}

async function sendToCampaign(client, campaign) {
  const channel = await client.channels.fetch(campaign.channel_id).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  const content = makeMarcelinaMessage(campaign.title);
  await channel.send({ content });

  await markRpCampaignRan(campaign.id, campaign.interval_minutes);
}

async function tick(client) {
  const due = await getDueRpCampaigns();
  for (const c of due) {
    try {
      await sendToCampaign(client, c);
    } catch (e) {
      console.error("[RP] send error:", e);
    }
  }
}

async function startRpScheduler(client) {
  const enabled = (process.env.RP_ENABLED ?? "1") !== "0";
  if (!enabled) return;

  const guildId = process.env.GUILD_ID;
  const channelId = process.env.RP_CHANNEL_ID;

  if (!guildId || !channelId) {
    console.log("[RP] Brak RP_GUILD_ID lub RP_CHANNEL_ID w env, scheduler nie startuje.");
    return;
  }

  const intervalMinutes = Number(process.env.RP_INTERVAL_MINUTES || 5);
  const title = process.env.RP_TITLE || "Marcelina von Skulszczit";

  await ensureRpCampaign({ guildId, channelId, intervalMinutes, title });

  await tick(client);

  setInterval(() => tick(client), 30 * 1000);
  console.log("[RP] Scheduler aktywny, sprawdza co 30 sekund.");
}

module.exports = { startRpScheduler };