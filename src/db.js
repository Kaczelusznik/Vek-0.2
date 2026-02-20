// src/db.js
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("Brak DATABASE_URL w env!");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS economy (
      guild_id TEXT NOT NULL,
      user_id  TEXT NOT NULL,
      balance  INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (guild_id, user_id)
    );
  `);
}

init()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => {
    console.error("DB INIT ERROR:", err);
    process.exit(1);
  });

async function getBalance(guildId, userId) {
  const res = await pool.query(
    "SELECT balance FROM economy WHERE guild_id=$1 AND user_id=$2",
    [guildId, userId]
  );
  return res.rows[0] ? res.rows[0].balance : 0;
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
    DO UPDATE SET balance = economy.balance + EXCLUDED.balance
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
    DO UPDATE SET balance = EXCLUDED.balance
  `,
    [guildId, userId, next]
  );

  return { ok: true, current, next };
}

async function topBalances(guildId, limit = 10) {
  const res = await pool.query(
    "SELECT user_id, balance FROM economy WHERE guild_id=$1 ORDER BY balance DESC LIMIT $2",
    [guildId, limit]
  );
  return res.rows;
}

module.exports = {
  getBalance,
  addMoney,
  removeMoney,
  topBalances,
};