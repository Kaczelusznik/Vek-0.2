// src/rpScheduler.js
const {
  ensureRpCampaign,
  getDueRpCampaigns,
  markRpCampaignRan,
  ensureRpState,
  getRpState,
  bumpRpScene,
  ensureRpMemory,
  getRpMemory,
  appendRpMemory,
  getOpenRpScene,
  createRpScene,
  closeRpScene,
  getWinnerOption,
} = require("./db");

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function buildOptions() {
  return [
    { key: "1", label: "Wejść cicho boczną bramą" },
    { key: "2", label: "Wezwać straż i wejść oficjalnie" },
    { key: "3", label: "Obejść mur i szukać śladu w terenie" },
  ];
}

function buildSceneText(title, sceneNo, memory) {
  const kronika = memory ? `**Kronika:**\n> ${memory.split("\n").slice(-3).join("\n> ")}\n\n` : "";
  return (
    `**[VEK] ${title}**\n` +
    `**Scena ${sceneNo}**\n\n` +
    kronika +
    `Marcelina von Skulszczit dociera do punktu misji. Na murach widać świeże ślady szarpnięć.\n\n` +
    `Co robicie?`
  );
}

function buildButtons(sceneId, options) {
  const row = new ActionRowBuilder();
  for (const opt of options) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`rpvote:${sceneId}:${opt.key}`)
        .setLabel(`${opt.key}. ${opt.label}`)
        .setStyle(ButtonStyle.Secondary)
    );
  }
  return [row];
}

async function closePreviousSceneIfAny(campaign) {
  const open = await getOpenRpScene(campaign.guild_id, campaign.channel_id);
  if (!open) return;

  const options = typeof open.options_json === "string" ? JSON.parse(open.options_json) : open.options_json;
  const winnerKey = await getWinnerOption(open.id, options);

  const winnerText = winnerKey
    ? options.find((o) => String(o.key) === String(winnerKey))?.label || winnerKey
    : "Brak głosów";

  await closeRpScene(open.id, winnerKey || "none");

  await appendRpMemory(
    campaign.guild_id,
    campaign.channel_id,
    `Wynik głosowania (Scena ${open.scene_no}): ${winnerKey || "—"} (${winnerText}).`
  );
}

async function sendToCampaign(client, campaign) {
  // anty duble: rezerwuj termin zanim wyślesz
  const moved = await markRpCampaignRan(campaign.id, campaign.interval_minutes);
  if (!moved || moved.ok === false) return;

  await ensureRpState(campaign.guild_id, campaign.channel_id);
  await ensureRpMemory(campaign.guild_id, campaign.channel_id);

  // zamknij poprzednią scenę (jeśli była) i zapisz wynik
  await closePreviousSceneIfAny(campaign);

  const st = await getRpState(campaign.guild_id, campaign.channel_id);
  const sceneNo = Number(st.scene_no) || 1;
  const memory = await getRpMemory(campaign.guild_id, campaign.channel_id);

  const channel = await client.channels.fetch(campaign.channel_id).catch(() => null);
  if (!channel || !channel.isTextBased()) return;

  const options = buildOptions();
  const text = buildSceneText(campaign.title, sceneNo, memory);

  // wyślij najpierw wiadomość bez przycisków, żeby mieć message id
  const msg = await channel.send({ content: text });

  // zapisz scenę do DB
  const scene = await createRpScene({
    guildId: campaign.guild_id,
    channelId: campaign.channel_id,
    sceneNo,
    text,
    options,
    messageId: msg.id,
  });

  // edytuj wiadomość i dodaj przyciski
  await msg.edit({ content: text, components: buildButtons(scene.id, options) });

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
  await ensureRpMemory(guildId, channelId);

  await tick(client);
  setInterval(() => tick(client), 30 * 1000);
  console.log("[RP] Scheduler aktywny, sprawdza co 30 sekund.");
}

module.exports = { startRpScheduler };