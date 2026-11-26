-- =====================================================================
-- CRICKET LIVE SCORE DATABASE SCHEMA
-- Target Database: cricket (in PostgreSQL / pgAdmin 4)
-- Version: 1.0.0
-- =====================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables in reverse dependency order if resetting
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notification_prefs CASCADE;
DROP TABLE IF EXISTS device_tokens CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS fans CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS poll_votes CASCADE;
DROP TABLE IF EXISTS poll_options CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS photo_galleries CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS article_tags CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS rankings CASCADE;
DROP TABLE IF EXISTS player_career_stats CASCADE;
DROP TABLE IF EXISTS points_table CASCADE;
DROP TABLE IF EXISTS fall_of_wickets CASCADE;
DROP TABLE IF EXISTS partnerships CASCADE;
DROP TABLE IF EXISTS bowling_figures CASCADE;
DROP TABLE IF EXISTS batting_scores CASCADE;
DROP TABLE IF EXISTS commentary_items CASCADE;
DROP TABLE IF EXISTS balls CASCADE;
DROP TABLE IF EXISTS innings CASCADE;
DROP TABLE IF EXISTS match_scorers CASCADE;
DROP TABLE IF EXISTS match_officials CASCADE;
DROP TABLE IF EXISTS match_players CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS squads CASCADE;
DROP TABLE IF EXISTS series_teams CASCADE;
DROP TABLE IF EXISTS series CASCADE;
DROP TABLE IF EXISTS officials CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- =====================================================================
-- 1. MASTERS TABLES
-- =====================================================================

-- Teams
CREATE TABLE teams (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  short_name      VARCHAR(10) NOT NULL UNIQUE,       -- e.g. IND, AUS, CSK, MI
  logo_url        TEXT,
  primary_color   VARCHAR(10) DEFAULT '#0284c7',
  team_type       VARCHAR(30) NOT NULL DEFAULT 'international', -- international, domestic, league, women
  country         VARCHAR(100) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Players
CREATE TABLE players (
  id              BIGSERIAL PRIMARY KEY,
  full_name       TEXT NOT NULL,
  short_name      VARCHAR(50) NOT NULL,              -- e.g. V Kohli, P Cummins
  dob             DATE,
  country         VARCHAR(100) NOT NULL,
  role            VARCHAR(30) NOT NULL DEFAULT 'batsman', -- batsman, bowler, all_rounder, wicket_keeper
  batting_style   VARCHAR(30) DEFAULT 'right_hand_bat',  -- right_hand_bat, left_hand_bat
  bowling_style   VARCHAR(50),                       -- right_arm_fast, right_arm_offbreak, left_arm_orthodox, etc.
  photo_url       TEXT,
  bio             TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Venues
CREATE TABLE venues (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  city            VARCHAR(100) NOT NULL,
  country         VARCHAR(100) NOT NULL,
  capacity        INT,
  ends            TEXT,                              -- e.g. Pavilion End, Media End
  pitch_profile   TEXT,                              -- e.g. Pace & Bounce, Balanced, Spin-friendly
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Officials (Umpires & Match Referees)
CREATE TABLE officials (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  country         VARCHAR(100) NOT NULL,
  official_type   VARCHAR(30) NOT NULL,              -- umpire, third_umpire, match_referee
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- 2. SERIES & TOURNAMENTS
-- =====================================================================

CREATE TABLE series (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  season          VARCHAR(20) NOT NULL,              -- e.g. 2026, 2026/27
  format          VARCHAR(20) NOT NULL,              -- T20, ODI, TEST, T10
  category        VARCHAR(30) NOT NULL DEFAULT 'international', -- international, league, domestic, women
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  qualifying_spots SMALLINT DEFAULT 4,
  points_rules    JSONB DEFAULT '{"win": 2, "tie": 1, "no_result": 1, "loss": 0}',
  status          VARCHAR(20) DEFAULT 'ongoing',    -- upcoming, ongoing, completed
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Teams participating in a Series
CREATE TABLE series_teams (
  series_id       BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  team_id         BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  group_name      VARCHAR(50) DEFAULT 'Group A',
  PRIMARY KEY (series_id, team_id)
);

-- Series Squads (Selected roster for the series)
CREATE TABLE squads (
  id              BIGSERIAL PRIMARY KEY,
  series_id       BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  team_id         BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id       BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  is_captain      BOOLEAN DEFAULT FALSE,
  is_keeper       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (series_id, team_id, player_id)
);

-- =====================================================================
-- 3. MATCHES
-- =====================================================================

CREATE TABLE matches (
  id                BIGSERIAL PRIMARY KEY,
  series_id         BIGINT REFERENCES series(id) ON DELETE SET NULL,
  match_no          TEXT NOT NULL,                   -- e.g. 'Match 14', '1st Semi-Final', 'Final'
  slug              TEXT,
  format            VARCHAR(20) NOT NULL,            -- T20, ODI, TEST, T10
  overs_per_innings SMALLINT DEFAULT 20,             -- NULL for Tests
  team_a_id         BIGINT NOT NULL REFERENCES teams(id),
  team_b_id         BIGINT NOT NULL REFERENCES teams(id),
  venue_id          BIGINT NOT NULL REFERENCES venues(id),
  start_time        TIMESTAMPTZ NOT NULL,
  status            VARCHAR(25) NOT NULL DEFAULT 'scheduled', -- scheduled, toss, live, break, stumps, completed, abandoned, no_result
  status_note       TEXT,                            -- e.g. 'Match delayed due to rain', 'Innings Break'
  toss_winner_id    BIGINT REFERENCES teams(id),
  toss_decision     VARCHAR(10),                     -- bat, bowl
  winner_team_id    BIGINT REFERENCES teams(id),
  win_margin_runs   INT,
  win_margin_wickets INT,
  win_margin_balls  INT,
  result_text       TEXT,                            -- e.g. 'India won by 18 runs'
  current_innings   SMALLINT DEFAULT 0,
  current_striker_id      BIGINT REFERENCES players(id),
  current_non_striker_id  BIGINT REFERENCES players(id),
  current_bowler_id       BIGINT REFERENCES players(id),
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_matches_status_start ON matches(status, start_time);
CREATE INDEX idx_matches_series ON matches(series_id);

-- Match Playing XI and Squad
CREATE TABLE match_players (
  id              BIGSERIAL PRIMARY KEY,
  match_id        BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id         BIGINT NOT NULL REFERENCES teams(id),
  player_id       BIGINT NOT NULL REFERENCES players(id),
  is_playing_xi   BOOLEAN DEFAULT TRUE,
  is_captain      BOOLEAN DEFAULT FALSE,
  is_keeper       BOOLEAN DEFAULT FALSE,
  is_substitute   BOOLEAN DEFAULT FALSE,
  batting_order   SMALLINT,
  UNIQUE (match_id, player_id)
);

-- Match Officials assignment
CREATE TABLE match_officials (
  id              BIGSERIAL PRIMARY KEY,
  match_id        BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  official_id     BIGINT NOT NULL REFERENCES officials(id),
  role            VARCHAR(30) NOT NULL               -- on_field_umpire, third_umpire, match_referee
);

-- Assigned scorers for a match
CREATE TABLE match_scorers (
  match_id        BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id         BIGINT NOT NULL,
  assigned_at     TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (match_id, user_id)
);

-- =====================================================================
-- 4. LIVE SCORING ENGINE (INNINGS, BALLS, COMMENTARY)
-- =====================================================================

CREATE TABLE innings (
  id              BIGSERIAL PRIMARY KEY,
  match_id        BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  innings_no      SMALLINT NOT NULL,                 -- 1..4, 5+ for super over
  batting_team_id BIGINT NOT NULL REFERENCES teams(id),
  bowling_team_id BIGINT NOT NULL REFERENCES teams(id),
  runs            INT DEFAULT 0,
  wickets         SMALLINT DEFAULT 0,
  legal_balls     INT DEFAULT 0,
  ex_b            INT DEFAULT 0,                     -- byes
  ex_lb           INT DEFAULT 0,                     -- leg byes
  ex_wd           INT DEFAULT 0,                     -- wides
  ex_nb           INT DEFAULT 0,                     -- no balls
  ex_p            INT DEFAULT 0,                     -- penalty runs
  target          INT,                               -- target for team batting second
  revised_overs   NUMERIC(4,1),                      -- DLS revised overs
  is_declared     BOOLEAN DEFAULT FALSE,
  is_follow_on    BOOLEAN DEFAULT FALSE,
  status          VARCHAR(20) DEFAULT 'live',        -- live, completed
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (match_id, innings_no)
);

CREATE INDEX idx_innings_match ON innings(match_id);

CREATE TABLE balls (
  id              BIGSERIAL PRIMARY KEY,
  innings_id      BIGINT NOT NULL REFERENCES innings(id) ON DELETE CASCADE,
  seq             INT NOT NULL,                      -- sequential delivery counter in this innings (1,2,3...)
  over_no         SMALLINT NOT NULL,                 -- 0-based over (0, 1, 2... 19)
  ball_in_over    SMALLINT NOT NULL,                 -- legal ball counter within this over (1..6)
  bowler_id       BIGINT NOT NULL REFERENCES players(id),
  striker_id      BIGINT NOT NULL REFERENCES players(id),
  non_striker_id  BIGINT NOT NULL REFERENCES players(id),
  runs_bat        SMALLINT DEFAULT 0,
  extra_type      VARCHAR(5),                        -- wd, nb, b, lb, p, NULL
  extra_runs      SMALLINT DEFAULT 0,
  is_legal        BOOLEAN NOT NULL DEFAULT TRUE,     -- FALSE if wide or no-ball
  is_four         BOOLEAN DEFAULT FALSE,
  is_six          BOOLEAN DEFAULT FALSE,
  is_wicket       BOOLEAN DEFAULT FALSE,
  dismissal_type  VARCHAR(30),                       -- bowled, caught, caught_and_bowled, lbw, run_out, stumped, hit_wicket, retired_hurt, etc.
  out_player_id   BIGINT REFERENCES players(id),
  fielder1_id     BIGINT REFERENCES players(id),
  fielder2_id     BIGINT REFERENCES players(id),
  is_free_hit     BOOLEAN DEFAULT FALSE,
  shot_zone       SMALLINT,                          -- 1 to 8 (wagon wheel sector)
  pitch_zone      SMALLINT,                          -- 1 to 6 (length/line grid)
  commentary      TEXT,
  client_uuid     UUID UNIQUE,                       -- idempotency token from scorer app
  created_by      BIGINT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (innings_id, seq)
);

CREATE INDEX idx_balls_innings_seq ON balls(innings_id, seq);
CREATE INDEX idx_balls_innings_over ON balls(innings_id, over_no);

-- Commentary feed items (ball commentary, over summaries, wickets, milestones, status changes)
CREATE TABLE commentary_items (
  id              BIGSERIAL PRIMARY KEY,
  match_id        BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  innings_id      BIGINT REFERENCES innings(id) ON DELETE CASCADE,
  ball_id         BIGINT REFERENCES balls(id) ON DELETE SET NULL,
  over_no         SMALLINT,
  ball_no         SMALLINT,
  type            VARCHAR(25) NOT NULL DEFAULT 'ball', -- ball, over_summary, status, milestone, text
  headline        TEXT,
  text            TEXT NOT NULL,
  runs            INT,
  is_wicket       BOOLEAN DEFAULT FALSE,
  is_boundary     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_commentary_match_desc ON commentary_items(match_id, id DESC);

-- =====================================================================
-- 5. SCORECARD CACHES & STATS (FAST READ MODELS)
-- =====================================================================

-- Batting performance per innings
CREATE TABLE batting_scores (
  id              BIGSERIAL PRIMARY KEY,
  innings_id      BIGINT NOT NULL REFERENCES innings(id) ON DELETE CASCADE,
  player_id       BIGINT NOT NULL REFERENCES players(id),
  batting_order   SMALLINT NOT NULL,
  runs            INT DEFAULT 0,
  balls           INT DEFAULT 0,
  dot_balls       INT DEFAULT 0,
  fours           INT DEFAULT 0,
  sixes           INT DEFAULT 0,
  strike_rate     NUMERIC(6,2) DEFAULT 0.00,
  dismissal_type  VARCHAR(30),
  dismissal_bowler_id   BIGINT REFERENCES players(id),
  dismissal_fielder1_id BIGINT REFERENCES players(id),
  dismissal_fielder2_id BIGINT REFERENCES players(id),
  dismissal_text  TEXT,                              -- e.g. "c Maxwell b Starc" or "not out"
  is_out          BOOLEAN DEFAULT FALSE,
  is_on_strike    BOOLEAN DEFAULT FALSE,
  is_batting      BOOLEAN DEFAULT FALSE,             -- currently at the crease
  UNIQUE (innings_id, player_id)
);

-- Bowling performance per innings
CREATE TABLE bowling_figures (
  id              BIGSERIAL PRIMARY KEY,
  innings_id      BIGINT NOT NULL REFERENCES innings(id) ON DELETE CASCADE,
  player_id       BIGINT NOT NULL REFERENCES players(id),
  bowling_order   SMALLINT NOT NULL,
  legal_balls     INT DEFAULT 0,
  overs_display   NUMERIC(4,1) DEFAULT 0.0,          -- e.g. 3.4
  maidens         INT DEFAULT 0,
  runs            INT DEFAULT 0,
  wickets         INT DEFAULT 0,
  wides           INT DEFAULT 0,
  no_balls        INT DEFAULT 0,
  dot_balls       INT DEFAULT 0,
  economy         NUMERIC(5,2) DEFAULT 0.00,
  is_bowling      BOOLEAN DEFAULT FALSE,             -- currently bowling this over
  UNIQUE (innings_id, player_id)
);

-- Partnerships per wicket
CREATE TABLE partnerships (
  id              BIGSERIAL PRIMARY KEY,
  innings_id      BIGINT NOT NULL REFERENCES innings(id) ON DELETE CASCADE,
  wicket_no       SMALLINT NOT NULL,                 -- 1st wicket, 2nd wicket...
  player1_id      BIGINT NOT NULL REFERENCES players(id),
  player2_id      BIGINT NOT NULL REFERENCES players(id),
  player1_runs    INT DEFAULT 0,
  player1_balls   INT DEFAULT 0,
  player2_runs    INT DEFAULT 0,
  player2_balls   INT DEFAULT 0,
  total_runs      INT DEFAULT 0,
  total_balls     INT DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE
);

-- Fall of Wickets
CREATE TABLE fall_of_wickets (
  id              BIGSERIAL PRIMARY KEY,
  innings_id      BIGINT NOT NULL REFERENCES innings(id) ON DELETE CASCADE,
  wicket_no       SMALLINT NOT NULL,
  player_id       BIGINT NOT NULL REFERENCES players(id),
  score           INT NOT NULL,                      -- team score when wicket fell
  over_display    NUMERIC(4,1) NOT NULL,             -- over e.g. 6.3
  legal_balls     INT NOT NULL
);

-- Tournament Points Table
CREATE TABLE points_table (
  id              BIGSERIAL PRIMARY KEY,
  series_id       BIGINT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  team_id         BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  group_name      VARCHAR(50) DEFAULT 'Group A',
  played          INT DEFAULT 0,
  won             INT DEFAULT 0,
  lost            INT DEFAULT 0,
  tied            INT DEFAULT 0,
  no_result       INT DEFAULT 0,
  points          INT DEFAULT 0,
  runs_scored     INT DEFAULT 0,
  overs_faced     NUMERIC(6,1) DEFAULT 0.0,
  runs_conceded   INT DEFAULT 0,
  overs_bowled    NUMERIC(6,1) DEFAULT 0.0,
  nrr             NUMERIC(6,3) DEFAULT 0.000,
  form_guide      TEXT[] DEFAULT '{}',               -- e.g. ARRAY['W','W','L']
  is_qualified    BOOLEAN DEFAULT FALSE,
  UNIQUE (series_id, team_id)
);

-- Player Career Aggregates
CREATE TABLE player_career_stats (
  id              BIGSERIAL PRIMARY KEY,
  player_id       BIGINT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  format          VARCHAR(20) NOT NULL,              -- TEST, ODI, T20I, T20_LEAGUE
  matches         INT DEFAULT 0,
  innings_batted  INT DEFAULT 0,
  not_outs        INT DEFAULT 0,
  runs            INT DEFAULT 0,
  high_score      INT DEFAULT 0,
  high_score_not_out BOOLEAN DEFAULT FALSE,
  batting_average NUMERIC(6,2) DEFAULT 0.00,
  balls_faced     INT DEFAULT 0,
  batting_strike_rate NUMERIC(6,2) DEFAULT 0.00,
  hundreds        INT DEFAULT 0,
  fifties         INT DEFAULT 0,
  fours           INT DEFAULT 0,
  sixes           INT DEFAULT 0,
  innings_bowled  INT DEFAULT 0,
  balls_bowled    INT DEFAULT 0,
  runs_conceded   INT DEFAULT 0,
  wickets         INT DEFAULT 0,
  best_bowling_match TEXT,                           -- e.g. '5/18'
  bowling_average NUMERIC(6,2) DEFAULT 0.00,
  economy_rate    NUMERIC(5,2) DEFAULT 0.00,
  bowling_strike_rate NUMERIC(6,2) DEFAULT 0.00,
  five_wickets    INT DEFAULT 0,
  ten_wickets     INT DEFAULT 0,
  UNIQUE (player_id, format)
);

-- Official ICC / Tournament Rankings
CREATE TABLE rankings (
  id              BIGSERIAL PRIMARY KEY,
  gender          VARCHAR(10) NOT NULL,              -- men, women
  category        VARCHAR(25) NOT NULL,              -- teams, batting, bowling, all_rounder
  format          VARCHAR(20) NOT NULL,              -- TEST, ODI, T20I
  rank            INT NOT NULL,
  entity_type     VARCHAR(10) NOT NULL,              -- player, team
  player_id       BIGINT REFERENCES players(id),
  team_id         BIGINT REFERENCES teams(id),
  rating          INT NOT NULL,
  points          INT,
  change_indicator VARCHAR(5) DEFAULT '0',           -- +1, -2, 0
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- 6. CONTENT CMS (ARTICLES, VIDEOS, GALLERIES, POLLS)
-- =====================================================================

CREATE TABLE articles (
  id              BIGSERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  body            TEXT NOT NULL,
  excerpt         TEXT,
  hero_image      TEXT,
  author_name     VARCHAR(100) DEFAULT 'Staff Reporter',
  status          VARCHAR(20) DEFAULT 'published',   -- draft, scheduled, published
  tags            JSONB DEFAULT '[]',                -- [{ "type": "player", "id": 1 }, { "type": "series", "id": 1 }]
  published_at    TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE videos (
  id              BIGSERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  video_url       TEXT NOT NULL,
  thumbnail_url   TEXT,
  category        VARCHAR(50) DEFAULT 'highlights',  -- highlights, interviews, press_conference, analysis
  duration_seconds INT DEFAULT 0,
  series_id       BIGINT REFERENCES series(id),
  match_id        BIGINT REFERENCES matches(id),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE photo_galleries (
  id              BIGSERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  cover_image     TEXT,
  series_id       BIGINT REFERENCES series(id),
  match_id        BIGINT REFERENCES matches(id),
  photo_count     INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE photos (
  id              BIGSERIAL PRIMARY KEY,
  gallery_id      BIGINT NOT NULL REFERENCES photo_galleries(id) ON DELETE CASCADE,
  image_url       TEXT NOT NULL,
  caption         TEXT,
  display_order   INT DEFAULT 0
);

CREATE TABLE polls (
  id              BIGSERIAL PRIMARY KEY,
  question        TEXT NOT NULL,
  match_id        BIGINT REFERENCES matches(id),
  status          VARCHAR(20) DEFAULT 'active',      -- active, closed
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE poll_options (
  id              BIGSERIAL PRIMARY KEY,
  poll_id         BIGINT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_text     TEXT NOT NULL,
  vote_count      INT DEFAULT 0
);

CREATE TABLE poll_votes (
  id              BIGSERIAL PRIMARY KEY,
  poll_id         BIGINT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id       BIGINT NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_uuid       VARCHAR(64) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (poll_id, user_uuid)
);

-- =====================================================================
-- 7. USERS, ROLES & NOTIFICATIONS
-- =====================================================================

CREATE TABLE admin_users (
  id              BIGSERIAL PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  full_name       VARCHAR(100) NOT NULL,
  role            VARCHAR(30) NOT NULL DEFAULT 'scorer', -- super_admin, admin, scorer, editor, viewer
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE fans (
  id              BIGSERIAL PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  display_name    VARCHAR(100) NOT NULL,
  avatar_url      TEXT,
  is_premium      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE follows (
  id              BIGSERIAL PRIMARY KEY,
  fan_id          BIGINT NOT NULL REFERENCES fans(id) ON DELETE CASCADE,
  entity_type     VARCHAR(20) NOT NULL,              -- team, player, series, match
  entity_id       BIGINT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (fan_id, entity_type, entity_id)
);

CREATE TABLE device_tokens (
  id              BIGSERIAL PRIMARY KEY,
  fan_id          BIGINT REFERENCES fans(id) ON DELETE CASCADE,
  fcm_token       TEXT NOT NULL UNIQUE,
  platform        VARCHAR(20) NOT NULL,              -- android, ios, web
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE notification_prefs (
  id              BIGSERIAL PRIMARY KEY,
  fan_id          BIGINT NOT NULL REFERENCES fans(id) ON DELETE CASCADE,
  match_start     BOOLEAN DEFAULT TRUE,
  wickets         BOOLEAN DEFAULT TRUE,
  milestones      BOOLEAN DEFAULT TRUE,
  innings_break   BOOLEAN DEFAULT TRUE,
  match_result    BOOLEAN DEFAULT TRUE,
  breaking_news   BOOLEAN DEFAULT FALSE,
  UNIQUE (fan_id)
);

-- =====================================================================
-- 7B. PLAYER REGISTRATIONS & YEARLY SUBSCRIPTIONS
-- =====================================================================

CREATE TABLE player_registrations (
  id                      BIGSERIAL PRIMARY KEY,
  membership_id           VARCHAR(50) UNIQUE NOT NULL,      -- e.g. CRIC-2026-8841
  full_name               TEXT NOT NULL,
  address                 TEXT NOT NULL,
  email                   VARCHAR(255) NOT NULL,
  mobile_number           VARCHAR(25) NOT NULL,
  photo_url               TEXT,
  tshirt_size             VARCHAR(10) NOT NULL,             -- S, M, L, XL, XXL, 3XL
  pant_size               VARCHAR(10) NOT NULL,             -- 28, 30, 32, 34, 36, 38, 40
  role                    VARCHAR(30) NOT NULL,             -- Batsman, Bowler, Allrounder, Wicket-Keeper
  payment_method          VARCHAR(50) NOT NULL,             -- UPI, Net Banking, Credit/Debit, Cash
  payment_screenshot_url  TEXT,
  amount_paid             NUMERIC(10,2) DEFAULT 2500.00,
  payment_status          VARCHAR(20) NOT NULL DEFAULT 'paid', -- paid, pending, expired
  subscription_start      TIMESTAMPTZ NOT NULL DEFAULT now(),
  subscription_end        TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 year'),
  created_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_registrations_membership ON player_registrations(membership_id);
CREATE INDEX idx_registrations_status ON player_registrations(payment_status, subscription_end);

-- =====================================================================
-- 8. AUDIT LOGS
-- =====================================================================

CREATE TABLE audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT,
  entity          VARCHAR(50) NOT NULL,              -- ball, match, innings, team
  entity_id       BIGINT NOT NULL,
  action          VARCHAR(30) NOT NULL,              -- insert_ball, undo_ball, edit_ball, toss, result
  old_state       JSONB,
  new_state       JSONB,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_entity ON audit_logs(entity, entity_id);

-- =====================================================================
-- END OF SCHEMA
-- =====================================================================
