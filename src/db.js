const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'vek.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS economy (
    guild_id TEXT NOT NULL,
    user_id  TEXT NOT NULL,
    balance  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (guild_id, user_id)
  );
`);

const stmtGet = db.prepare(`SELECT balance FROM economy WHERE guild_id=? AND user_id=?`);
const stmtInc = db.prepare(`
  INSERT INTO economy (guild_id, user_id, balance)
  VALUES (?, ?, ?)
  ON CONFLICT(guild_id, user_id) DO UPDATE SET balance = balance + excluded.balance
`);
const stmtSet = db.prepare(`
  INSERT INTO economy (guild_id, user_id, balance)
  VALUES (?, ?, ?)
  ON CONFLICT(guild_id, user_id) DO UPDATE SET balance = excluded.balance
`);
const stmtTop = db.prepare(`
  SELECT user_id, balance
  FROM economy
  WHERE guild_id=?
  ORDER BY balance DESC
  LIMIT ?
`);

function getBalance(guildId, userId) {
  const row = stmtGet.get(guildId, userId);
  return row ? row.balance : 0;
}

function addMoney(guildId, userId, amount) {
  if (!Number.isInteger(amount)) throw new Error('Kwota musi być liczbą całkowitą.');
  if (amount <= 0) throw new Error('Kwota musi być > 0.');
  stmtInc.run(guildId, userId, amount);
  return getBalance(guildId, userId);
}

function removeMoney(guildId, userId, amount, { allowNegative = false } = {}) {
  if (!Number.isInteger(amount)) throw new Error('Kwota musi być liczbą całkowitą.');
  if (amount <= 0) throw new Error('Kwota musi być > 0.');

  const current = getBalance(guildId, userId);
  const next = current - amount;

  if (!allowNegative && next < 0) {
    return { ok: false, current, next: current };
  }

  stmtSet.run(guildId, userId, next);
  return { ok: true, current, next };
}

function topBalances(guildId, limit = 10) {
  return stmtTop.all(guildId, limit);
}

module.exports = {
  db,
  getBalance,
  addMoney,
  removeMoney,
  topBalances,
};
