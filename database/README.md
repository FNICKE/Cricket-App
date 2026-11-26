# Cricket Database Setup (PostgreSQL / pgAdmin 4)

Your database name is: **`cricket`**

---

## Option 1: Execute in pgAdmin 4 (Easiest)

1. Open **pgAdmin 4** on your computer.
2. In the left-hand Browser tree, navigate to:
   **Servers** &rarr; **PostgreSQL (v18 or your version)** &rarr; **Databases** &rarr; **`cricket`**.
3. Right-click on **`cricket`** and click **Query Tool**.
4. In the Query Tool toolbar:
   - Click the **Open File** icon (folder icon), or press `Ctrl + O`.
   - Select `c:\Grabodo\Cricket\database\schema.sql`.
   - Click the **Execute / Run** button (Play icon ▶️ or press `F5`).
   - You will see: *"Query returned successfully in ... ms"*.
5. Next, open and run the seed data:
   - Open `c:\Grabodo\Cricket\database\seed.sql`.
   - Click **Execute / Run** (Play icon ▶️ or press `F5`).
6. Right-click the **Schemas** &rarr; **public** &rarr; **Tables** in pgAdmin and choose **Refresh**.
   You will now see all ~30 tables populated with teams, players, venues, and a live India vs Australia clash ready to score!

---

## Option 2: Execute via Windows PowerShell / CMD

If you have your PostgreSQL `postgres` password:

```powershell
# Run Schema DDL
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d cricket -f "c:\Grabodo\Cricket\database\schema.sql"

# Run Seed Data
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d cricket -f "c:\Grabodo\Cricket\database\seed.sql"
```

---

## Tables Overview

| Group | Tables |
|---|---|
| **Masters** | `teams`, `players`, `venues`, `officials` |
| **Series & Squads** | `series`, `series_teams`, `squads` |
| **Matches** | `matches`, `match_players`, `match_officials`, `match_scorers` |
| **Live Scoring** | `innings`, `balls`, `commentary_items` |
| **Scorecard Caches** | `batting_scores`, `bowling_figures`, `partnerships`, `fall_of_wickets`, `points_table`, `player_career_stats`, `rankings` |
| **Content CMS** | `articles`, `videos`, `photo_galleries`, `photos`, `polls`, `poll_options`, `poll_votes` |
| **Users & Alerts** | `admin_users`, `fans`, `follows`, `device_tokens`, `notification_prefs` |
| **Audit Logs** | `audit_logs` |
