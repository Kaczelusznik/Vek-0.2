// src/rpScheduler.js
const {
  ensureRpCampaign,
  getDueRpCampaigns,
  markRpCampaignRan,
  ensureRpState,
  getRpState,
  bumpRpScene,
} = require("./db");

function makeMarcelinaMessage(title, sceneNo) {
  const now = new Date().toLocaleString("pl-PL");
  return (
    `**[VEK] ${title}**\n` +
    `**Scena ${sceneNo}**\n\n` +
    `Cicho mówisz pod nosem "Potwór". Rozkaz Króla Anastazji nie zostawia miejsca na wahanie.\n` +
    `Marcelina von Skulszczit zaciska palce na paskach ekwipunku i rusza w stronę bramy. ${now}`
  );
}

async function sendToCampaign(client, campaign) {
  // 1) anty duble i brak spamu: najpierw rezerwujemy kolejny termin
  const moved = await markRpCampaignRan(campaign.id, campaign.interval_minutes);
  if (!moved || moved.ok === false) return;

  // 2) numer sceny z rp_state
  await ensureRpState(campaign.guild_id, campaign.channel_id);
  const st = await getRpState(campaign.guild_id, campaign.channel_id);
  const sceneNo = Number(st.scene_no) || 1;

  // 3) wysyłka
  const channel = await client.channels.fetch(campaign.channel_id).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  const content = makeMarcelinaMessage(campaign.title, sceneNo);
  await channel.send({ content });

  // 4) podbij numer sceny na następną turę
  await bumpRpScene(campaign.guild_id, campaign.channel_id);
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

  // U Ciebie w env jest GUILD_ID, więc zostawiamy
  const guildId = process.env.GUILD_ID;
  const channelId = process.env.RP_CHANNEL_ID;

  if (!guildId || !channelId) {
    console.log("[RP] Brak GUILD_ID lub RP_CHANNEL_ID w env, scheduler nie startuje.");
    return;
  }

  const intervalMinutes = Number(process.env.RP_INTERVAL_MINUTES || 5);
  const title = process.env.RP_TITLE || "Marcelina von Skulszczit";

  await ensureRpCampaign({ guildId, channelId, intervalMinutes, title });
  await ensureRpState(guildId, channelId);

  // od razu spróbuj wysłać, jeśli next_run_at jest due
  await tick(client);

  // potem sprawdzaj często, ale wysyłaj tylko gdy due
  setInterval(() => tick(client), 30 * 1000);
  console.log("[RP] Scheduler aktywny, sprawdza co 30 sekund.");
}

module.exports = { startRpScheduler };