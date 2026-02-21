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
   INIT — tworzy pełne tabele zgodne z Railway
======================================================= */
async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS economy (
      guild_id   TEXT NOT NULL,
      user_id    TEXT NOT NULL,
      balance    INTEGER NOT NULL DEFAULT 0,
      level      INTEGER NOT NULL DEFAULT 1,
      exp        INTEGER NOT NULL DEFAULT 0,
      created_at DATE NOT NULL DEFAULT NOW(),
      updated_at DATE NOT NULL DEFAULT NOW(),
      PRIMARY KEY (guild_id, user_id)
    );
  `);

  // migracje (bezpieczne)
  await pool.query(`ALTER TABLE economy ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1;`);
  await pool.query(`ALTER TABLE economy ADD COLUMN IF NOT EXISTS exp INTEGER NOT NULL DEFAULT 0;`);
  await pool.query(`ALTER TABLE economy ADD COLUMN IF NOT EXISTS created_at DATE NOT NULL DEFAULT NOW();`);
  await pool.query(`ALTER TABLE economy ADD COLUMN IF NOT EXISTS updated_at DATE NOT NULL DEFAULT NOW();`);

  // server_state (plaga i inne globalne rzeczy)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS server_state (
      key TEXT PRIMARY KEY,
      value_int INTEGER NOT NULL DEFAULT 0,
      last_auto_inc DATE NOT NULL DEFAULT NOW()
    );
  `);

  // migracja kolumny, jeśli tabela powstała wcześniej bez last_auto_inc
  await pool.query(
    `ALTER TABLE server_state ADD COLUMN IF NOT EXISTS last_auto_inc DATE NOT NULL DEFAULT NOW();`
  );

  // domyślny rekord (bezpiecznie)
  await pool.query(`
    INSERT INTO server_state (key, value_int, last_auto_inc)
    VALUES ('plague_level', 0, NOW())
    ON CONFLICT (key) DO NOTHING;
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
    SELECT balance, level, exp, created_at, updated_at
    FROM economy
    WHERE guild_id = $1 AND user_id = $2
  `,
    [guildId, userId]
  );

  if (!res.rows[0]) {
    return {
      balance: 0,
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
  return profile.balance;
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

/* =======================================================
   EXP / LEVEL (pod przyszłe levele)
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
  if (!Number.isInteger(level) || level < 1) {
    throw new Error("Level musi być >= 1.");
  }

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
   SERVER STATE — PLAGA (weekly auto growth)
   - auto rośnie +1 co pełny tydzień
   - ręczne ustawienie NIE resetuje last_auto_inc
======================================================= */
async function getPlagueLevel() {
  const res = await pool.query(
    `SELECT value_int, last_auto_inc FROM server_state WHERE key = $1`,
    ["plague_level"]
  );

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

    // przesuwamy datę o pełne tygodnie (nadgania offline, nie "gubi" dni)
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
  if (!Number.isInteger(level) || level < 0) {
    throw new Error("Poziom plagi musi być >= 0");
  }

  // NIE ruszamy last_auto_inc (Twoje wymaganie)
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

/* ======================================================= */

module.exports = {
  getProfile,
  getBalance,
  addMoney,
  removeMoney,
  topBalances,
  addExp,
  setLevel,
  getPlagueLevel,
  setPlagueLevel,
};