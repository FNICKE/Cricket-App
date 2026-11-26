-- =====================================================================
-- CRICKET LIVE SCORE SEED DATA
-- Target Database: cricket (in PostgreSQL / pgAdmin 4)
-- =====================================================================

-- 1. TEAMS
INSERT INTO teams (id, name, short_name, logo_url, primary_color, team_type, country) VALUES
(1, 'India', 'IND', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop', '#0055A5', 'international', 'India'),
(2, 'Australia', 'AUS', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop', '#FFD100', 'international', 'Australia'),
(3, 'England', 'ENG', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop', '#0B1A30', 'international', 'England'),
(4, 'South Africa', 'SA', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop', '#007A3D', 'international', 'South Africa'),
(5, 'Chennai Super Kings', 'CSK', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop', '#FFFF00', 'league', 'India'),
(6, 'Mumbai Indians', 'MI', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop', '#004BA0', 'league', 'India');

ALTER SEQUENCE teams_id_seq RESTART WITH 10;

-- 2. VENUES
INSERT INTO venues (id, name, city, country, capacity, ends, pitch_profile) VALUES
(1, 'Wankhede Stadium', 'Mumbai', 'India', 33108, 'Tata End, Garware Pavilion End', 'True bounce, high-scoring surface with good carry'),
(2, 'Melbourne Cricket Ground (MCG)', 'Melbourne', 'Australia', 100024, 'Members End, Great Southern Stand End', 'Pace and carry, large boundaries'),
(3, 'Narendra Modi Stadium', 'Ahmedabad', 'India', 132000, 'Adani Pavilion End, Reliance End', 'Balanced, variable bounce as match progresses'),
(4, 'Lord''s Cricket Ground', 'London', 'England', 31100, 'Pavilion End, Nursery End', 'Traditional slope, seam movement early on');

ALTER SEQUENCE venues_id_seq RESTART WITH 10;

-- 3. OFFICIALS
INSERT INTO officials (id, name, country, official_type) VALUES
(1, 'Richard Illingworth', 'England', 'umpire'),
(2, 'Nitin Menon', 'India', 'umpire'),
(3, 'Kumar Dharmasena', 'Sri Lanka', 'third_umpire'),
(4, 'Javagal Srinath', 'India', 'match_referee');

ALTER SEQUENCE officials_id_seq RESTART WITH 10;

-- 4. PLAYERS
-- India
INSERT INTO players (id, full_name, short_name, dob, country, role, batting_style, bowling_style, bio) VALUES
(1, 'Rohit Sharma', 'R Sharma', '1987-04-30', 'India', 'batsman', 'right_hand_bat', 'right_arm_offbreak', 'Legendary Indian opener and aggressive captain.'),
(2, 'Virat Kohli', 'V Kohli', '1988-11-05', 'India', 'batsman', 'right_hand_bat', 'right_arm_medium', 'Modern batting great, unmatched chase-master in limited overs.'),
(3, 'Suryakumar Yadav', 'SA Yadav', '1990-09-14', 'India', 'batsman', 'right_hand_bat', 'right_arm_medium', 'Dynamic 360-degree T20 specialist with extreme shot range.'),
(4, 'Rishabh Pant', 'R Pant', '1997-10-04', 'India', 'wicket_keeper', 'left_hand_bat', NULL, 'Explosive wicketkeeper-batsman capable of match-winning heroics.'),
(5, 'Hardik Pandya', 'H Pandya', '1993-10-11', 'India', 'all_rounder', 'right_hand_bat', 'right_arm_fast_medium', 'Impact all-rounder delivering high pace and lower-order power.'),
(6, 'Ravindra Jadeja', 'R Jadeja', '1988-12-06', 'India', 'all_rounder', 'left_hand_bat', 'left_arm_orthodox', 'Premier spin all-rounder and elite boundary rider.'),
(7, 'Jasprit Bumrah', 'J Bumrah', '1993-12-06', 'India', 'bowler', 'right_hand_bat', 'right_arm_fast', 'World-class strike bowler renowned for lethal yorkers and deceptive changes of pace.'),
(8, 'Arshdeep Singh', 'A Singh', '1999-02-05', 'India', 'bowler', 'left_hand_bat', 'left_arm_medium_fast', 'Left-arm swing and death overs specialist.'),
(9, 'Kuldeep Yadav', 'K Yadav', '1994-12-14', 'India', 'bowler', 'left_hand_bat', 'left_arm_wristspin', 'Deceptive wrist-spinner with devastating googlies.'),
(10, 'Shubman Gill', 'S Gill', '1999-09-08', 'India', 'batsman', 'right_hand_bat', 'right_arm_offbreak', 'Classy top-order batsman with classical strokeplay.'),
(11, 'Mohammed Siraj', 'M Siraj', '1994-03-13', 'India', 'bowler', 'right_hand_bat', 'right_arm_fast', 'Aggressive new-ball bowler with testing outswing.');

-- Australia
INSERT INTO players (id, full_name, short_name, dob, country, role, batting_style, bowling_style, bio) VALUES
(21, 'Travis Head', 'T Head', '1993-12-29', 'Australia', 'batsman', 'left_hand_bat', 'right_arm_offbreak', 'Destructive top-order power hitter.'),
(22, 'David Warner', 'D Warner', '1986-10-27', 'Australia', 'batsman', 'left_hand_bat', 'right_arm_legbreak', 'Veteran aggressive opening batsman.'),
(23, 'Mitchell Marsh', 'M Marsh', '1991-10-20', 'Australia', 'all_rounder', 'right_hand_bat', 'right_arm_medium', 'Hard-hitting batsman and seam bowler.'),
(24, 'Glenn Maxwell', 'G Maxwell', '1988-10-14', 'Australia', 'all_rounder', 'right_hand_bat', 'right_arm_offbreak', 'Unpredictable showstopper, the Big Show of global T20.'),
(25, 'Marcus Stoinis', 'M Stoinis', '1989-08-16', 'Australia', 'all_rounder', 'right_hand_bat', 'right_arm_medium_fast', 'Muscular finisher and handy seam bowler.'),
(26, 'Josh Inglis', 'J Inglis', '1995-03-04', 'Australia', 'wicket_keeper', 'right_hand_bat', NULL, 'Quick-handed keeper and inventive 360-degree batsman.'),
(27, 'Pat Cummins', 'P Cummins', '1993-05-08', 'Australia', 'bowler', 'right_hand_bat', 'right_arm_fast', 'World Cup winning captain and relentless fast bowler.'),
(28, 'Mitchell Starc', 'M Starc', '1990-01-30', 'Australia', 'bowler', 'left_hand_bat', 'left_arm_fast', 'Thunderbolt left-arm pacer with unmatched toe-crushers.'),
(29, 'Adam Zampa', 'A Zampa', '1992-03-31', 'Australia', 'bowler', 'right_hand_bat', 'right_arm_legbreak', 'Australia premier limited-overs wrist spinner.'),
(30, 'Josh Hazlewood', 'J Hazlewood', '1991-01-08', 'Australia', 'bowler', 'left_hand_bat', 'right_arm_fast_medium', 'Metronomic line-and-length pace bowler.'),
(31, 'Steven Smith', 'S Smith', '1989-06-02', 'Australia', 'batsman', 'right_hand_bat', 'right_arm_legbreak', 'Unorthodox batting genius and anchor.');

ALTER SEQUENCE players_id_seq RESTART WITH 100;

-- 5. TOURNAMENT / SERIES
INSERT INTO series (id, name, slug, season, format, category, start_date, end_date, points_rules, status) VALUES
(1, 'ICC Men''s T20 World Cup 2026', 'icc-mens-t20-world-cup-2026', '2026', 'T20', 'international', '2026-11-01', '2026-12-05', '{"win": 2, "tie": 1, "no_result": 1, "loss": 0}', 'ongoing');

INSERT INTO series_teams (series_id, team_id, group_name) VALUES
(1, 1, 'Super 8 - Group 1'),
(1, 2, 'Super 8 - Group 1'),
(1, 3, 'Super 8 - Group 2'),
(1, 4, 'Super 8 - Group 2');

ALTER SEQUENCE series_id_seq RESTART WITH 10;

-- 6. MATCH (INDIA VS AUSTRALIA - LIVE CLASH)
INSERT INTO matches (
  id, series_id, match_no, slug, format, overs_per_innings,
  team_a_id, team_b_id, venue_id, start_time,
  status, status_note, toss_winner_id, toss_decision,
  current_innings, current_striker_id, current_non_striker_id, current_bowler_id
) VALUES (
  1, 1, 'Match 28 - Super 8', 'ind-vs-aus-super-8-2026', 'T20', 20,
  1, 2, 1, now() - interval '2 hours',
  'live', 'Australia need 42 runs in 22 balls', 2, 'bowl',
  2, 24, 25, 7
);

ALTER SEQUENCE matches_id_seq RESTART WITH 10;

-- Match Playing XI for India
INSERT INTO match_players (match_id, team_id, player_id, is_playing_xi, is_captain, is_keeper, batting_order) VALUES
(1, 1, 1, true, true, false, 1),
(1, 1, 2, true, false, false, 2),
(1, 1, 3, true, false, false, 3),
(1, 1, 4, true, false, true, 4),
(1, 1, 5, true, false, false, 5),
(1, 1, 6, true, false, false, 6),
(1, 1, 7, true, false, false, 7),
(1, 1, 8, true, false, false, 8),
(1, 1, 9, true, false, false, 9),
(1, 1, 10, true, false, false, 10),
(1, 1, 11, true, false, false, 11);

-- Match Playing XI for Australia
INSERT INTO match_players (match_id, team_id, player_id, is_playing_xi, is_captain, is_keeper, batting_order) VALUES
(1, 2, 21, true, false, false, 1),
(1, 2, 22, true, false, false, 2),
(1, 2, 23, true, false, false, 3),
(1, 2, 24, true, false, false, 4),
(1, 2, 25, true, false, false, 5),
(1, 2, 26, true, false, true, 6),
(1, 2, 27, true, true, false, 7),
(1, 2, 28, true, false, false, 8),
(1, 2, 29, true, false, false, 9),
(1, 2, 30, true, false, false, 10),
(1, 2, 31, true, false, false, 11);

-- 7. INNINGS
-- 1st Innings: India 186/5 (20.0 Overs) - Completed
INSERT INTO innings (
  id, match_id, innings_no, batting_team_id, bowling_team_id,
  runs, wickets, legal_balls, ex_b, ex_lb, ex_wd, ex_nb, ex_p,
  status
) VALUES (
  1, 1, 1, 1, 2,
  186, 5, 120, 2, 4, 6, 2, 0,
  'completed'
);

-- 2nd Innings: Australia 145/3 (16.2 Overs) - Currently Live! Target: 187
INSERT INTO innings (
  id, match_id, innings_no, batting_team_id, bowling_team_id,
  runs, wickets, legal_balls, ex_b, ex_lb, ex_wd, ex_nb, ex_p,
  target, status
) VALUES (
  2, 1, 2, 2, 1,
  145, 3, 98, 1, 3, 4, 1, 0,
  187, 'live'
);

ALTER SEQUENCE innings_id_seq RESTART WITH 10;

-- 8. SCORECARD CACHES FOR 1ST INNINGS (INDIA BATTING)
INSERT INTO batting_scores (innings_id, player_id, batting_order, runs, balls, dot_balls, fours, sixes, strike_rate, dismissal_type, dismissal_bowler_id, dismissal_fielder1_id, dismissal_text, is_out) VALUES
(1, 1, 1, 48, 28, 8, 5, 3, 171.43, 'caught', 28, 21, 'c Head b Starc', true),
(1, 2, 2, 62, 44, 12, 6, 2, 140.91, 'caught', 27, 26, 'c †Inglis b Cummins', true),
(1, 3, 3, 35, 18, 4, 3, 3, 194.44, 'bowled', 29, NULL, 'b Zampa', true),
(1, 4, 4, 12, 9, 3, 1, 0, 133.33, 'run_out', NULL, 24, 'run out (Maxwell)', true),
(1, 5, 5, 21, 14, 3, 2, 1, 150.00, 'not_out', NULL, NULL, 'not out', false),
(1, 6, 6, 4, 7, 3, 0, 0, 57.14, 'caught', 30, 25, 'c Stoinis b Hazlewood', true);

INSERT INTO bowling_figures (innings_id, player_id, bowling_order, legal_balls, overs_display, maidens, runs, wickets, wides, no_balls, dot_balls, economy) VALUES
(1, 28, 1, 24, 4.0, 0, 42, 1, 2, 1, 8, 10.50),
(1, 30, 2, 24, 4.0, 0, 31, 1, 1, 0, 11, 7.75),
(1, 27, 3, 24, 4.0, 0, 38, 1, 1, 1, 9, 9.50),
(1, 29, 4, 24, 4.0, 0, 39, 1, 2, 0, 7, 9.75),
(1, 25, 5, 24, 4.0, 0, 32, 0, 0, 0, 8, 8.00);

-- Fall of Wickets (1st Innings)
INSERT INTO fall_of_wickets (innings_id, wicket_no, player_id, score, over_display, legal_balls) VALUES
(1, 1, 1, 74, 7.2, 44),
(1, 2, 3, 128, 13.4, 82),
(1, 3, 4, 145, 15.3, 93),
(1, 4, 2, 168, 18.1, 109),
(1, 5, 6, 186, 20.0, 120);

-- 9. SCORECARD CACHES FOR 2ND INNINGS (AUSTRALIA CHASE - LIVE)
INSERT INTO batting_scores (innings_id, player_id, batting_order, runs, balls, dot_balls, fours, sixes, strike_rate, dismissal_type, dismissal_bowler_id, dismissal_fielder1_id, dismissal_text, is_out, is_on_strike, is_batting) VALUES
(2, 21, 1, 45, 26, 7, 5, 2, 173.08, 'caught', 7, 4, 'c †Pant b Bumrah', true, false, false),
(2, 22, 2, 18, 15, 6, 2, 0, 120.00, 'bowled', 8, NULL, 'b Arshdeep', true, false, false),
(2, 23, 3, 24, 21, 8, 2, 1, 114.29, 'lbw', 9, NULL, 'lbw b Kuldeep', true, false, false),
(2, 24, 4, 34, 18, 4, 3, 2, 188.89, NULL, NULL, NULL, 'batting', false, true, true),
(2, 25, 5, 18, 12, 3, 1, 1, 150.00, NULL, NULL, NULL, 'batting', false, false, true);

INSERT INTO bowling_figures (innings_id, player_id, bowling_order, legal_balls, overs_display, maidens, runs, wickets, wides, no_balls, dot_balls, economy, is_bowling) VALUES
(2, 8, 1, 24, 4.0, 0, 34, 1, 1, 0, 10, 8.50, false),
(2, 7, 2, 20, 3.2, 0, 22, 1, 1, 0, 12, 6.60, true),
(2, 11, 3, 18, 3.0, 0, 35, 0, 1, 1, 5, 11.67, false),
(2, 9, 4, 24, 4.0, 0, 38, 1, 1, 0, 8, 9.50, false),
(2, 5, 5, 12, 2.0, 0, 14, 0, 0, 0, 4, 7.00, false);

-- Active Partnership (4th wicket)
INSERT INTO partnerships (innings_id, wicket_no, player1_id, player2_id, player1_runs, player1_balls, player2_runs, player2_balls, total_runs, total_balls, is_active) VALUES
(2, 4, 24, 25, 34, 18, 18, 12, 52, 30, true);

-- Fall of Wickets (2nd Innings)
INSERT INTO fall_of_wickets (innings_id, wicket_no, player_id, score, over_display, legal_balls) VALUES
(2, 1, 22, 32, 3.4, 22),
(2, 2, 21, 68, 7.1, 43),
(2, 3, 23, 93, 11.2, 68);

-- 10. RECENT BALLS IN THE CURRENT INNINGS (Overs 15 and 16)
INSERT INTO balls (
  innings_id, seq, over_no, ball_in_over, bowler_id, striker_id, non_striker_id,
  runs_bat, extra_type, extra_runs, is_legal, is_four, is_six, is_wicket,
  commentary
) VALUES
-- Over 15 (Kuldeep to Stoinis & Maxwell)
(2, 91, 15, 1, 9, 25, 24, 1, NULL, 0, true, false, false, false, 'Kuldeep Yadav to Stoinis, 1 run, pushed down towards long-off.'),
(2, 92, 15, 2, 9, 24, 25, 4, NULL, 0, true, true, false, false, 'Kuldeep Yadav to Maxwell, FOUR! Reverse sweep played with absolute precision past backward point!'),
(2, 93, 15, 3, 9, 24, 25, 0, NULL, 0, true, false, false, false, 'Kuldeep Yadav to Maxwell, no run, tossed up, defended right back down the deck.'),
(2, 94, 15, 4, 9, 24, 25, 6, NULL, 0, true, false, true, false, 'Kuldeep Yadav to Maxwell, SIX! Smoked high and mighty over deep mid-wicket into the second tier!'),
(2, 95, 15, 5, 9, 24, 25, 1, NULL, 0, true, false, false, false, 'Kuldeep Yadav to Maxwell, 1 run, flipper on the pads, worked gently to square leg.'),
(2, 96, 15, 6, 9, 25, 24, 2, NULL, 0, true, false, false, false, 'Kuldeep Yadav to Stoinis, 2 runs, nudged wide of deep cover, quick double taken.');

-- Over 16 (Bumrah to Maxwell)
INSERT INTO balls (
  innings_id, seq, over_no, ball_in_over, bowler_id, striker_id, non_striker_id,
  runs_bat, extra_type, extra_runs, is_legal, is_four, is_six, is_wicket,
  commentary
) VALUES
(2, 97, 16, 1, 7, 24, 25, 0, NULL, 0, true, false, false, false, 'Jasprit Bumrah to Maxwell, no run, pinpoint 144kph yorker on off stump, dug out cleanly.'),
(2, 98, 16, 2, 7, 24, 25, 1, NULL, 0, true, false, false, false, 'Jasprit Bumrah to Maxwell, 1 run, slower cutter, nudged off the hip to mid-wicket.');

-- 11. COMMENTARY FEED ITEMS
INSERT INTO commentary_items (match_id, innings_id, over_no, ball_no, type, headline, text, runs, is_boundary) VALUES
(1, 2, 15, 2, 'ball', 'FOUR!', 'Kuldeep Yadav to Maxwell, FOUR! Reverse sweep played with absolute precision past backward point!', 4, true),
(1, 2, 15, 4, 'ball', 'SIX RUNS!', 'Kuldeep Yadav to Maxwell, SIX! Smoked high and mighty over deep mid-wicket into the second tier! What a hit!', 6, true),
(1, 2, 15, 6, 'over_summary', 'End of Over 15', '14 runs from Kuldeep''s final over. Australia 144/3. Maxwell 33*, Stoinis 18*. Required rate climbs to 10.8 RPO.', 14, false),
(1, 2, 16, 1, 'ball', 'Dot ball', 'Jasprit Bumrah to Maxwell, no run, pinpoint 144kph yorker on off stump, dug out cleanly. Masterful execution!', 0, false),
(1, 2, 16, 2, 'ball', 'Single', 'Jasprit Bumrah to Maxwell, 1 run, slower cutter, nudged off the hip to mid-wicket. Strike rotates.', 1, false);

-- 12. TOURNAMENT POINTS TABLE (SUPER 8)
INSERT INTO points_table (series_id, team_id, group_name, played, won, lost, tied, no_result, points, runs_scored, overs_faced, runs_conceded, overs_bowled, nrr, form_guide, is_qualified) VALUES
(1, 1, 'Super 8 - Group 1', 2, 2, 0, 0, 0, 4, 382, 40.0, 310, 40.0, 1.800, ARRAY['W', 'W'], true),
(1, 2, 'Super 8 - Group 1', 2, 1, 1, 0, 0, 2, 340, 39.4, 335, 40.0, 0.220, ARRAY['W', 'L'], false),
(1, 3, 'Super 8 - Group 2', 2, 1, 1, 0, 0, 2, 320, 40.0, 330, 40.0, -0.250, ARRAY['L', 'W'], false),
(1, 4, 'Super 8 - Group 2', 2, 2, 0, 0, 0, 4, 360, 38.2, 315, 40.0, 1.340, ARRAY['W', 'W'], true);

-- 13. ICC RANKINGS (MEN'S T20)
INSERT INTO rankings (gender, category, format, rank, entity_type, team_id, rating, change_indicator) VALUES
('men', 'teams', 'T20I', 1, 'team', 1, 268, '0'),
('men', 'teams', 'T20I', 2, 'team', 2, 262, '+1'),
('men', 'teams', 'T20I', 3, 'team', 3, 255, '-1'),
('men', 'teams', 'T20I', 4, 'team', 4, 250, '0');

INSERT INTO rankings (gender, category, format, rank, entity_type, player_id, rating, change_indicator) VALUES
('men', 'batting', 'T20I', 1, 'player', 3, 895, '0'),
('men', 'batting', 'T20I', 2, 'player', 21, 878, '+2'),
('men', 'batting', 'T20I', 3, 'player', 2, 820, '0'),
('men', 'bowling', 'T20I', 1, 'player', 7, 780, '0'),
('men', 'bowling', 'T20I', 2, 'player', 29, 745, '+1'),
('men', 'all_rounder', 'T20I', 1, 'player', 5, 280, '0'),
('men', 'all_rounder', 'T20I', 2, 'player', 24, 265, '+1');

-- 14. NEWS ARTICLES
INSERT INTO articles (title, slug, body, excerpt, hero_image, author_name, status, tags) VALUES
(
  'India vs Australia Super 8 Thriller: Maxwell and Stoinis Keep Aussies in the Hunt',
  'ind-vs-aus-super-8-thriller-maxwell-stoinis',
  'A packed Wankhede Stadium is witnessing a high-voltage clash between two titans of world cricket. After Virat Kohli sublime 62 and Rohit Sharma fireworks helped India post 186/5, Australia are battling fiercely in pursuit of 187. Glenn Maxwell and Marcus Stoinis have engineered a blistering 50-run partnership, setting up an electric climax with Jasprit Bumrah holding the ball in the death overs.',
  'Australia require 42 runs from the final 22 deliveries with Glenn Maxwell leading the charge against Jasprit Bumrah at Wankhede.',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
  'Senior Cricket Correspondent',
  'published',
  '[{"type": "series", "id": 1}, {"type": "match", "id": 1}, {"type": "team", "id": 1}, {"type": "team", "id": 2}]'
),
(
  'Bumrah Yorker Precision: How The Speahead Dismantled Top Orders Throughout T20WC 2026',
  'bumrah-yorker-precision-t20wc-2026',
  'Analyzing the biomechanics, trajectory, and deceptive changes of pace that make Jasprit Bumrah the most lethal bowler in white-ball cricket.',
  'Deep-dive tactical analysis of Jasprit Bumrah unparalleled death-bowling wizardry in the T20 World Cup.',
  'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=800&auto=format&fit=crop',
  'Data & Analytics Desk',
  'published',
  '[{"type": "player", "id": 7}, {"type": "team", "id": 1}]'
);

-- 15. ADMIN & SCORER USERS
-- Default passwords: 'Password123!' (bcrypt hash)
INSERT INTO admin_users (email, password_hash, full_name, role, is_active) VALUES
('admin@cricket.local', '$2b$10$w099/z7l02yWJ.mY2V8X3eeH6K3GzM9Fw4yGfLp6MlhYyvK1Y97C6', 'Super Administrator', 'super_admin', true),
('scorer@cricket.local', '$2b$10$w099/z7l02yWJ.mY2V8X3eeH6K3GzM9Fw4yGfLp6MlhYyvK1Y97C6', 'Official Match Scorer', 'scorer', true);

-- Assign scorer to live match 1
INSERT INTO match_scorers (match_id, user_id) VALUES
(1, 2);

-- 16. PLAYER REGISTRATIONS & YEARLY SUBSCRIPTIONS
INSERT INTO player_registrations (
  membership_id, full_name, address, email, mobile_number, photo_url,
  tshirt_size, pant_size, role, payment_method, payment_screenshot_url,
  amount_paid, payment_status, subscription_start, subscription_end
) VALUES
(
  'CRIC-2026-0101',
  'Rohit Verma',
  'Flat 402, Sea Green Apts, Worli, Mumbai 400018',
  'rohit.verma@example.com',
  '+91 98201 12345',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop',
  'L',
  '32',
  'Batsman',
  'UPI (GPay / PhonePe)',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop',
  2500.00,
  'paid',
  now() - interval '2 months',
  now() + interval '10 months'
),
(
  'CRIC-2026-0102',
  'Aakash Patel',
  'B-12 Shivalik Residency, Drive-in Road, Ahmedabad 380052',
  'aakash.patel@example.com',
  '+91 98795 67890',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop',
  'XL',
  '34',
  'Allrounder',
  'Bank Transfer (IMPS)',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop',
  2500.00,
  'paid',
  now() - interval '10 days',
  now() + interval '355 days'
),
(
  'CRIC-2025-0045',
  'Sameer Khan',
  'Plot 14, Jubilee Hills, Hyderabad 500033',
  'sameer.khan@example.com',
  '+91 94401 22334',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop',
  'M',
  '30',
  'Bowler',
  'UPI (Paytm)',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop',
  2500.00,
  'expired',
  now() - interval '13 months',
  now() - interval '1 month'
);

-- =====================================================================
-- SEED DATA COMPLETE
-- =====================================================================
