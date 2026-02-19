# 🜏 VEK 0.2 – Discord Bot

Custom Discord bot stworzony dla uniwersum **VEK / Wekretia**.
Bot obsługuje system ekonomii, komendy użytkowe oraz administracyjne, wykorzystując **discord.js v15**.

---

## ✦ Funkcje

* Slash commands
* System ekonomii (saldo, transfer, leaderboard)
* Rzuty kośćmi z parserem (np. `2k20+5`)
* Komendy administracyjne
* Embed-based help menu
* Status bota dynamiczny
* Obsługa `.env`
* Gotowy pod hosting (Railway / VPS)

---

## ✦ Technologie

* Node.js (v18+)
* discord.js v15
* dotenv
* GitHub
* Railway (lub inny hosting)

---

## ✦ Instalacja lokalna

```bash
git clone https://github.com/Kaczelusznik/Vek-0.2.git
cd Vek-0.2
npm install
```

Utwórz plik `.env` w głównym katalogu:

```
DISCORD_TOKEN=TWÓJ_TOKEN
CLIENT_ID=TWÓJ_CLIENT_ID
DATABASE_URL=TWÓJ_DATABASE_URL
```

Uruchom:

```bash
npm start
```

---

## ✦ Deploy komend

```bash
node scripts/deploy-commands.js
```

---

## ✦ Struktura projektu

```
src/
 ├── commands/
 │   ├── ping.js
 │   ├── roll.js
 │   ├── balance.js
 │   └── ...
 ├── events/
 │   └── interactionCreate.js
 ├── index.js
scripts/
 └── deploy-commands.js
```

---

## ✦ Przykładowe komendy

| Komenda        | Opis                    |
| -------------- | ----------------------- |
| `/ping`        | Sprawdza czy bot działa |
| `/roll`        | Rzut kością (np. 2k6+3) |
| `/balance`     | Sprawdzenie salda       |
| `/transfer`    | Przekazanie waluty      |
| `/leaderboard` | Ranking graczy          |

---

## ✦ Hosting

Bot może być hostowany na:

* Railway
* VPS (PM2)
* Render
* Docker

---

## ✦ Wymagania

* Node 18+
* Discord Application z włączonymi:

  * Bot
  * MESSAGE CONTENT INTENT (jeśli potrzebne)

---

## ✦ Autor

Daniel Abramek
Projekt tworzony dla serwera VEK.

---

Jeśli chcesz, mogę teraz:

* zrobić **bardziej klimatyczną wersję pod lore VEK**
* zrobić README bardziej „enterprise”
* dodać badge (Node version, license, status)
* zrobić wersję pod CV / portfolio
* albo zrobić README pod hosting Railway krok po kroku

Co robimy?
