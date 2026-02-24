// src/db.js
const { Pool } = require("pg");

const SHOULD_INIT = process.env.DB_INIT !== "0";

if (!process.env.DATABASE_URL) {
  console.error("Brak DATABASE_URL w env!");
  if (SHOULD_INIT) process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/* =======================================================
   HELPERS
======================================================= */
function parseAmount2(input) {
  const n = typeof input === "string" ? Number(input.replace(",", ".")) : Number(input);

  if (!Number.isFinite(n)) throw new Error("Kwota musi być liczbą.");
  if (n <= 0) throw new Error("Kwota musi być > 0.");

  const rounded = Math.round(n * 100) / 100;
  if (!(rounded > 0)) throw new Error("Kwota musi być > 0.");

  return { num: rounded, str: rounded.toFixed(2) };
}

/* =======================================================
   INIT
   Uwaga: rp_campaigns jest już u Ciebie w DB – NIE zmieniamy typów.
======================================================= */
async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS economy (
      guild_id        TEXT NOT NULL,
      user_id         TEXT NOT NULL,
      balance         INTEGER NOT NULL DEFAULT 0,
      crystal_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
      level           INTEGER NOT NULL DEFAULT 1,
      exp             INTEGER NOT NULL DEFAULT 0,
      created_at      DATE NOT NULL DEFAULT NOW(),
      updated_at      DATE NOT NULL DEFAULT NOW(),
      PRIMARY KEY (guild_id, user_id)
    );
  `);

  // migracje (bezpieczne)
  await pool.query(`ALTER TABLE economy ADD COLUMN IF NOT EXISTS balance INTEGER NOT NULL DEFAULT 0;`);
  await pool.query(
    `ALTER TABLE economy ADD COLUMN IF NOT EXISTS crystal_balance NUMERIC(12,2) NOT NULL DEFAULT 0;`
  );
  await pool.query(`ALTER TABLE economy ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1;`);
  await pool.query(`ALTER TABLE economy ADD COLUMN IF NOT EXISTS exp INTEGER NOT NULL DEFAULT 0;`);
  await pool.query(`ALTER TABLE economy ADD COLUMN IF NOT EXISTS created_at DATE NOT NULL DEFAULT NOW();`);
  await pool.query(`ALTER TABLE economy ADD COLUMN IF NOT EXISTS updated_at DATE NOT NULL DEFAULT NOW();`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS server_state (
      key TEXT PRIMARY KEY,
      value_int INTEGER NOT NULL DEFAULT 0,
      last_auto_inc DATE NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(
    `ALTER TABLE server_state ADD COLUMN IF NOT EXISTS last_auto_inc DATE NOT NULL DEFAULT NOW();`
  );

  await pool.query(`
    INSERT INTO server_state (key, value_int, last_auto_inc)
    VALUES ('plague_level', 0, NOW())
    ON CONFLICT (key) DO NOTHING;
  `);

  // rp_campaigns – zostawiamy tak jak masz. Jeśli tabela już istnieje, CREATE IF NOT EXISTS nic nie popsuje.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rp_campaigns (
      id               SERIAL PRIMARY KEY,
      guild_id         TEXT NOT NULL,
      channel_id       TEXT NOT NULL,
      is_enabled       BOOLEAN NOT NULL DEFAULT FALSE,
      interval_minutes INTEGER NOT NULL DEFAULT 5,
      next_run_at      BIGINT NOT NULL,
      title            TEXT NOT NULL DEFAULT 'Marcelina von Skulszczit',
      created_at       BIGINT NOT NULL,
      updated_at       INTEGER NOT NULL
    );
  `);
}

if (SHOULD_INIT) {
  init()
    .then(() => console.log("PostgreSQL connected"))
    .catch((err) => console.error("DB INIT ERROR:", err));
}

/* =======================================================
   PROFILE
======================================================= */
async function getProfile(guildId, userId) {
  const res = await pool.query(
    `
    SELECT balance, crystal_balance, level, exp, created_at, updated_at
    FROM economy
    WHERE guild_id = $1 AND user_id = $2
  `,
    [guildId, userId]
  );

  if (!res.rows[0]) {
    return {
      balance: 0,
      crystal_balance: "0.00",
      level: 1,
      exp: 0,
      created_at: null,
      updated_at: null,
    };
  }

  return res.rows[0];
}

/* =======================================================
   BALANCE
======================================================= */
async function getBalance(guildId, userId) {
  const profile = await getProfile(guildId, userId);
  return Number(profile.balance) || 0;
}

async function addMoney(guildId, userId, amount) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Kwota musi być liczbą całkowitą > 0.");
  }

  await pool.query(
    `
    INSERT INTO economy (guild_id, user_id, balance)
    VALUES ($1, $2, $3)
    ON CONFLICT (guild_id, user_id)
    DO UPDATE SET
      balance = economy.balance + EXCLUDED.balance,
      updated_at = NOW()
  `,
    [guildId, userId, amount]
  );

  return getBalance(guildId, userId);
}

async function removeMoney(guildId, userId, amount, { allowNegative = false } = {}) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Kwota musi być liczbą całkowitą > 0.");
  }

  const current = await getBalance(guildId, userId);
  const next = current - amount;

  if (!allowNegative && next < 0) {
    return { ok: false, current, next: current };
  }

  await pool.query(
    `
    INSERT INTO economy (guild_id, user_id, balance)
    VALUES ($1, $2, $3)
    ON CONFLICT (guild_id, user_id)
    DO UPDATE SET
      balance = EXCLUDED.balance,
      updated_at = NOW()
  `,
    [guildId, userId, next]
  );

  return { ok: true, current, next };
}

/* =======================================================
   CRYSTALS
======================================================= */
async function getCrystalBalance(guildId, userId) {
  const profile = await getProfile(guildId, userId);
  const raw = profile.crystal_balance ?? "0.00";
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

async function addCrystal(guildId, userId, amount) {
  const { str } = parseAmount2(amount);

  await pool.query(
    `
    INSERT INTO economy (guild_id, user_id, crystal_balance)
    VALUES ($1, $2, $3::numeric)
    ON CONFLICT (guild_id, user_id)
    DO UPDATE SET
      crystal_balance = economy.crystal_balance + EXCLUDED.crystal_balance,
      updated_at = NOW()
  `,
    [guildId, userId, str]
  );

  return getCrystalBalance(guildId, userId);
}

async function removeCrystal(guildId, userId, amount, { allowNegative = false } = {}) {
  const { num } = parseAmount2(amount);

  const current = await getCrystalBalance(guildId, userId);
  const nextNum = Math.round((current - num) * 100) / 100;

  if (!allowNegative && nextNum < 0) {
    return { ok: false, current, next: current };
  }

  await pool.query(
    `
    INSERT INTO economy (guild_id, user_id, crystal_balance)
    VALUES ($1, $2, $3::numeric)
    ON CONFLICT (guild_id, user_id)
    DO UPDATE SET
      crystal_balance = $3::numeric,
      updated_at = NOW()
  `,
    [guildId, userId, nextNum.toFixed(2)]
  );

  return { ok: true, current, next: nextNum };
}

/* =======================================================
   TRANSFER
======================================================= */
async function transferBalance(guildId, fromId, toId, amount) {
  if (!Number.isInteger(amount) || amount <= 0) throw new Error("bad_amount");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const fromRes = await client.query(
      `
      SELECT balance
      FROM economy
      WHERE guild_id = $1 AND user_id = $2
      FOR UPDATE
    `,
      [guildId, fromId]
    );

    const fromBalance = fromRes.rowCount ? Number(fromRes.rows[0].balance) : 0;
    if (fromBalance < amount) throw new Error("insufficient");

    await client.query(
      `
      INSERT INTO economy (guild_id, user_id, balance)
      VALUES ($1, $2, 0)
      ON CONFLICT (guild_id, user_id) DO NOTHING
    `,
      [guildId, toId]
    );

    const updatedFrom = await client.query(
      `
      UPDATE economy
      SET balance = balance - $3,
          updated_at = NOW()
      WHERE guild_id = $1 AND user_id = $2
      RETURNING balance
    `,
      [guildId, fromId, amount]
    );

    await client.query(
      `
      UPDATE economy
      SET balance = balance + $3,
          updated_at = NOW()
      WHERE guild_id = $1 AND user_id = $2
    `,
      [guildId, toId, amount]
    );

    await client.query("COMMIT");
    return { fromBalance: Number(updatedFrom.rows[0].balance) };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

/* =======================================================
   LEADERBOARD
======================================================= */
async function topBalances(guildId, limit = 10) {
  const res = await pool.query(
    `
    SELECT user_id, balance
    FROM economy
    WHERE guild_id = $1
    ORDER BY balance DESC
    LIMIT $2
  `,
    [guildId, limit]
  );
  return res.rows;
}

async function topCrystalBalances(guildId, limit = 10) {
  const res = await pool.query(
    `
    SELECT user_id, crystal_balance
    FROM economy
    WHERE guild_id = $1
    ORDER BY crystal_balance DESC
    LIMIT $2
  `,
    [guildId, limit]
  );
  return res.rows;
}

/* =======================================================
   EXP / LEVEL
======================================================= */
async function addExp(guildId, userId, amount) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("EXP musi być liczbą całkowitą > 0.");
  }

  await pool.query(
    `
    INSERT INTO economy (guild_id, user_id, exp)
    VALUES ($1, $2, $3)
    ON CONFLICT (guild_id, user_id)
    DO UPDATE SET
      exp = economy.exp + EXCLUDED.exp,
      updated_at = NOW()
  `,
    [guildId, userId, amount]
  );

  return getProfile(guildId, userId);
}

async function setLevel(guildId, userId, level) {
  if (!Number.isInteger(level) || level < 1) throw new Error("Level musi być >= 1.");

  await pool.query(
    `
    INSERT INTO economy (guild_id, user_id, level)
    VALUES ($1, $2, $3)
    ON CONFLICT (guild_id, user_id)
    DO UPDATE SET
      level = EXCLUDED.level,
      updated_at = NOW()
  `,
    [guildId, userId, level]
  );

  return getProfile(guildId, userId);
}

/* =======================================================
   SERVER STATE  PLAGA
======================================================= */
async function getPlagueLevel() {
  const res = await pool.query(`SELECT value_int, last_auto_inc FROM server_state WHERE key = $1`, [
    "plague_level",
  ]);

  if (!res.rows[0]) return 0;

  let level = Number(res.rows[0].value_int) || 0;

  const last = new Date(res.rows[0].last_auto_inc);
  const now = new Date();

  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;

  const diffMs = now.getTime() - last.getTime();
  const weeksPassed = Math.floor(diffMs / weekMs);

  if (weeksPassed > 0) {
    level += weeksPassed;
    const nextLast = new Date(last.getTime() + weeksPassed * weekMs);

    await pool.query(
      `
      UPDATE server_state
      SET value_int = $2,
          last_auto_inc = $3
      WHERE key = $1
    `,
      ["plague_level", level, nextLast]
    );
  }

  return level;
}

async function setPlagueLevel(level) {
  if (!Number.isInteger(level) || level < 0) throw new Error("Poziom plagi musi być >= 0");

  await pool.query(
    `
    UPDATE server_state
    SET value_int = $2
    WHERE key = $1
  `,
    ["plague_level", level]
  );

  return level;
}

/* =======================================================
   RP CAMPAIGNS
   UWAGA: next_run_at / created_at = BIGINT, updated_at = INTEGER (u Ciebie int4)
   Trzymamy CZAS W SEKUNDACH (epoch seconds), żeby mieścił się w int4.
======================================================= */
function nowSec() {
  return Math.floor(Date.now() / 1000);
}

async function ensureRpCampaign({ guildId, channelId, intervalMinutes = 5, title = "Marcelina von Skulszczit" }) {
  const t = nowSec();

  const found = await pool.query(
    `
    SELECT id
    FROM rp_campaigns
    WHERE guild_id = $1 AND channel_id = $2
    LIMIT 1
    `,
    [guildId, channelId]
  );

  if (found.rowCount) {
    const id = found.rows[0].id;

    const updated = await pool.query(
      `
      UPDATE rp_campaigns
      SET is_enabled = TRUE,
          interval_minutes = $1,
          title = $2,
          updated_at = $3::integer
      WHERE id = $4
      RETURNING *
      `,
      [intervalMinutes, title, t, id]
    );

    return updated.rows[0];
  }

  const inserted = await pool.query(
    `
    INSERT INTO rp_campaigns
      (guild_id, channel_id, is_enabled, interval_minutes, next_run_at, title, created_at, updated_at)
    VALUES
      ($1, $2, TRUE, $3, $4::bigint, $5, $6::bigint, $7::integer)
    RETURNING *
    `,
    [guildId, channelId, intervalMinutes, t, title, t, t]
  );

  return inserted.rows[0];
}

async function getDueRpCampaigns() {
  const t = nowSec();
  const res = await pool.query(
    `
    SELECT *
    FROM rp_campaigns
    WHERE is_enabled = TRUE
      AND next_run_at <= $1::bigint
    ORDER BY next_run_at ASC
  `,
    [t]
  );
  return res.rows;
}

async function markRpCampaignRan(id, intervalMinutes) {
  const t = nowSec();
  const intervalSec = Math.max(1, Number(intervalMinutes) * 60);
  const next = t + intervalSec;

  // anty-duble: przesuwamy tylko jeśli nadal jest "due"
  const res = await pool.query(
    `
    UPDATE rp_campaigns
    SET next_run_at = $2::bigint,
        updated_at = $3::integer
    WHERE id = $1
      AND next_run_at <= $3::bigint
    RETURNING next_run_at
    `,
    [id, next, t]
  );

  return { ok: res.rowCount > 0, next_run_at: next };
}

module.exports = {
  getProfile,

  getBalance,
  addMoney,
  removeMoney,
  transferBalance,
  topBalances,

  getCrystalBalance,
  addCrystal,
  removeCrystal,
  topCrystalBalances,

  addExp,
  setLevel,

  getPlagueLevel,
  setPlagueLevel,

  ensureRpCampaign,
  getDueRpCampaigns,
  markRpCampaignRan,
};