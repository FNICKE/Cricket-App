
# Cricket Live Score Platform (Cricbuzz-Style)

A complete real-time cricket platform powering three products from one shared scoring engine:
1. **Fan Live Score Website** (Desktop + Mobile Web)
2. **Admin & Scorer Keypad Panel** (Sub-second delivery scoring)
3. **Real-time API & WebSocket Server** (Express + Socket.IO + PostgreSQL)

---

## 🗄️ Database Setup in pgAdmin 4

Your database name is: **`cricket`**

1. Open **pgAdmin 4**.
2. Expand **Servers** &rarr; **Databases** &rarr; Right-click **`cricket`** &rarr; Click **Query Tool**.
3. Open and run [`database/schema.sql`](file:///c:/Grabodo/Cricket/database/schema.sql) (Press `F5`).
   - Creates all ~30 tables across Masters, Series, Matches, Innings, Balls, Scorecard Caches, CMS, and Users.
4. Open and run [`database/seed.sql`](file:///c:/Grabodo/Cricket/database/seed.sql) (Press `F5`).
   - Seeds international teams (IND, AUS, ENG, SA), venues (Wankhede, MCG), top players (Kohli, Rohit, Bumrah, Maxwell, Stoinis, Starc), and a live T20 World Cup clash (India 186/5 vs Australia 145/3).
5. Refresh the **Tables** list in pgAdmin 4.

---

## 🚀 How to Run the Platform

You can launch all 3 products with one click or run them individually:

### 1. One-Click Launch (All Services)
Double-click:
```bat
start-all.bat
```

### 2. Individual Services
| Service | Script | URL | Description |
|---|---|---|---|
| **API + Socket.IO** | `start-api.bat` | `http://localhost:4000` | REST API + WebSocket broadcaster |
| **Scorer Admin Panel** | `start-admin.bat` | `http://localhost:5173` | Tactile scoring keypad with keyboard shortcuts |
| **Fan Live Web Portal** | `start-web.bat` | `http://localhost:3000` | Cricbuzz-style live scorecards & commentary |

---

## 📐 Project Structure

```
cricket/
├── database/
│   ├── schema.sql              # Complete PostgreSQL DDL (~30 tables)
│   ├── seed.sql                # Teams, players, venues, live T20 clash
│   └── README.md               # pgAdmin 4 step-by-step instructions
├── packages/
│   └── shared/                 # Pure TypeScript cricket scoring engine
│       ├── src/
│       │   ├── formatters.ts   # Overs (16.2), CRR, RRR, SR, Econ, NRR formulas
│       │   ├── scoringEngine.ts# Pure immutable ball processor & strike rotator
│       │   └── types.ts        # Shared cricket types & interfaces
│       └── test/               # Automated unit tests
├── apps/
│   ├── api/                    # Express REST API + Socket.IO server (Port 4000)
│   │   ├── src/
│   │   │   ├── server.ts       # Express server & socket bootstrapper
│   │   │   ├── socket.ts       # Socket.IO match & lobby rooms
│   │   │   ├── store.ts        # Real-time state manager & cache
│   │   │   ├── db.ts           # PostgreSQL client pool (pgAdmin 'cricket' DB)
│   │   │   └── routes/         # /matches, /admin, /home, /scorecard
│   │   └── .env                # Configured for PostgreSQL localhost:5432/cricket
│   ├── admin/                  # React + Vite Scorer Dashboard (Port 5173)
│   │   └── src/App.tsx         # Tactile scoring keypad, Wicket/Extra modals
│   └── web/                    # React + Vite Fan Match Centre (Port 3000)
│       └── src/App.tsx         # Live score strip, tabs, ball commentary
├── start-all.bat               # One-click launcher
├── start-api.bat
├── start-admin.bat
└── start-web.bat
```

---

## ⚡ Scorer Keyboard Shortcuts

When scoring in the Scorer Panel (`http://localhost:5173`), you can use keyboard shortcuts for instant scoring:
- `0` &rarr; Dot ball (0 runs)
- `1` &rarr; Single (1 run, strike rotates)
- `2` &rarr; Double (2 runs)
- `3` &rarr; Three (3 runs, strike rotates)
- `4` &rarr; Boundary FOUR
- `6` &rarr; Maximum SIX
- `W` &rarr; Open Wicket modal (Bowled, Caught, LBW, Run Out, Stumped...)
- `D` &rarr; Wide (+1 extra run, run picker)
- `N` &rarr; No Ball (+1 extra run, Free Hit indicator)
- `S` &rarr; Swap Strike manually
- `U` &rarr; Undo last delivery (recalculates entire innings)
#
