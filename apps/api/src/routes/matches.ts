import { Router } from 'express';
import bcrypt from 'bcryptjs';
import {
  issuePlayerToken,
  requireAuth,
  requirePlayerAuth,
  requirePlayerOwnership,
  requireRoles
} from '../auth.ts';
import { getPlayerPasswordHash, setPlayerPasswordHash } from '../playerCredentials.ts';
import {
  getHomeData,
  getMatchLive,
  getMatchScorecard,
  getMatchCommentary,
  getPointsTable,
  getRankings,
  getPlayerRegistrations,
  registerNewPlayer,
  updatePlayerPaymentStatus,
  findPlayerForLogin,
  renewPlayerSubscription,
  getScheduleData,
  getRecentMatchesData,
  getActiveMatchesData,
  getNewsData,
  getSeriesData,
  getTeamsData,
  getVideosData,
  getRankingsData,
  getMoreData,
  getVillageTeams,
  registerVillageTeam,
  TEAMS,
  PLAYERS,
  SQUADS
} from '../store.ts';

export const matchesRouter = Router();

// GET /api/v1/home
matchesRouter.get('/home', (req, res) => {
  res.json(getHomeData());
});

// GET /api/v1/matches
matchesRouter.get('/matches', (req, res) => {
  const homeData = getHomeData();
  res.json({ matches: homeData.scoreStrip });
});

// GET /api/v1/matches/:id/live
matchesRouter.get('/matches/:id/live', (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const liveState = getMatchLive(matchId);
  res.json(liveState);
});

// GET /api/v1/matches/:id/scorecard
matchesRouter.get('/matches/:id/scorecard', (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const scorecard = getMatchScorecard(matchId);
  res.json(scorecard);
});

// GET /api/v1/matches/:id/commentary
matchesRouter.get('/matches/:id/commentary', (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const commentary = getMatchCommentary(matchId);
  res.json({ commentary });
});

// GET /api/v1/matches/:id/squads
matchesRouter.get('/matches/:id/squads', (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const squadIds = SQUADS[matchId] || SQUADS[1];
  res.json({
    teamA: squadIds.teamA.map((id) => PLAYERS[id]),
    teamB: squadIds.teamB.map((id) => PLAYERS[id])
  });
});

// GET /api/v1/points-table
matchesRouter.get('/points-table', (req, res) => {
  res.json({ table: getPointsTable() });
});

// GET /api/v1/rankings
matchesRouter.get('/rankings', (req, res) => {
  res.json(getRankings());
});

// GET /api/v1/teams
matchesRouter.get('/teams', (req, res) => {
  res.json({ teams: Object.values(TEAMS) });
});

// GET /api/v1/players
matchesRouter.get('/players', (req, res) => {
  res.json({ players: Object.values(PLAYERS) });
});

// =====================================================================
// PLAYER REGISTRATION & MEMBERSHIP ROUTES
// =====================================================================

// GET /api/v1/players/registrations
matchesRouter.get('/players/registrations', (req, res) => {
  const registrations = getPlayerRegistrations();
  res.json({ success: true, count: registrations.length, registrations });
});

// POST /api/v1/players/register
matchesRouter.post('/players/register', async (req, res) => {
  try {
    const {
      fullName,
      address,
      email,
      mobileNumber,
      photoUrl,
      tshirtSize,
      pantSize,
      role,
      paymentMethod,
      paymentScreenshotUrl,
      amountPaid,
      password
    } = req.body;

    if (typeof fullName !== 'string' || !fullName.trim() || fullName.length > 100
      || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255
      || typeof mobileNumber !== 'string' || !mobileNumber.trim()
      || !tshirtSize || !pantSize || !role || !paymentMethod
      || typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({
        success: false,
        message: 'Complete all required fields and choose a password between 12 and 72 bytes.'
      });
    }

    if (getPlayerRegistrations().some((registration) => registration.email.toLowerCase() === email.trim().toLowerCase())) {
      return res.status(409).json({ success: false, message: 'An account already uses this email.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const registration = registerNewPlayer({
      fullName,
      address: address || 'India',
      email: email.trim().toLowerCase(),
      mobileNumber,
      photoUrl,
      tshirtSize,
      pantSize,
      role,
      paymentMethod,
      paymentScreenshotUrl,
      amountPaid: amountPaid ? Number(amountPaid) : 2500
    });
    setPlayerPasswordHash(registration.id, passwordHash);

    res.status(201).json({
      success: true,
      message: 'Player registered successfully with 1-Year Membership!',
      registration,
      token: issuePlayerToken(registration.id)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/v1/players/registrations/:id/status
matchesRouter.patch('/players/registrations/:id/status', requireAuth, requireRoles('super_admin'), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  const updated = updatePlayerPaymentStatus(id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Registration not found' });
  }
  res.json({ success: true, registration: updated });
});

// POST /api/v1/players/login
matchesRouter.post('/players/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (typeof identifier !== 'string' || !identifier.trim()
      || typeof password !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({
        success: false,
        message: 'Enter your Membership ID, email, or mobile number and password.'
      });
    }

    const player = findPlayerForLogin(identifier);
    const passwordHash = player ? getPlayerPasswordHash(player.id) : undefined;
    if (!player || !passwordHash || !(await bcrypt.compare(password, passwordHash))) {
      return res.status(401).json({
        success: false,
        message: 'Player login details are incorrect. Check your details or register a player account.'
      });
    }

    return res.json({
      success: true,
      message: `Welcome back, ${player.fullName}!`,
      player,
      token: issuePlayerToken(player.id)
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/players/profile/:id
matchesRouter.get('/players/profile/:id', requirePlayerAuth, requirePlayerOwnership, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const all = getPlayerRegistrations();
  const player = all.find((p) => p.id === id);
  if (!player) {
    return res.status(404).json({ success: false, message: 'Player profile not found.' });
  }
  res.json({ success: true, player });
});

// POST /api/v1/players/renew/:id
matchesRouter.post('/players/renew/:id', requirePlayerAuth, requirePlayerOwnership, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const renewed = renewPlayerSubscription(id);
  if (!renewed) {
    return res.status(404).json({ success: false, message: 'Player not found for renewal.' });
  }
  res.json({
    success: true,
    message: 'Membership renewed for 1 Year (+365 days)!',
    player: renewed
  });
});

// =====================================================================
// ALL 10 PAGES REST ROUTES
// =====================================================================

// 1. GET /api/v1/schedule
matchesRouter.get('/schedule', (req, res) => {
  res.json({ success: true, schedule: getScheduleData() });
});

// 2. GET /api/v1/recent-matches
matchesRouter.get('/recent-matches', (req, res) => {
  res.json({ success: true, matches: getRecentMatchesData() });
});

// 3. GET /api/v1/active-matches
matchesRouter.get('/active-matches', (req, res) => {
  res.json({ success: true, matches: getActiveMatchesData() });
});

// 4. GET /api/v1/news
matchesRouter.get('/news', (req, res) => {
  res.json({ success: true, news: getNewsData() });
});

// 5. GET /api/v1/series
matchesRouter.get('/series', (req, res) => {
  res.json({ success: true, series: getSeriesData() });
});

// 6. GET /api/v1/teams
matchesRouter.get('/teams', (req, res) => {
  res.json({ success: true, teams: getTeamsData() });
});

// 7. GET /api/v1/videos
matchesRouter.get('/videos', (req, res) => {
  res.json({ success: true, videos: getVideosData() });
});

// 8. GET /api/v1/rankings
matchesRouter.get('/rankings', (req, res) => {
  res.json({ success: true, ...getRankingsData() });
});

// 9. GET /api/v1/more
matchesRouter.get('/more', (req, res) => {
  res.json({ success: true, ...getMoreData() });
});

// 10. VILLAGE PREMIUM LEAGUE (500 Rs) ROUTES
matchesRouter.get('/village-league/teams', (req, res) => {
  res.json({ success: true, teams: getVillageTeams() });
});

matchesRouter.post('/village-league/register', (req, res) => {
  try {
    const {
      taluka,
      association,
      villageName,
      teamName,
      captainName,
      captainMobile,
      captainEmail,
      paymentMethod,
      paymentScreenshotUrl,
      players
    } = req.body;

    if (!taluka || !villageName || !teamName || !captainName || !captainMobile) {
      return res.status(400).json({
        success: false,
        message: 'Compulsory fields missing (Taluka, Village Name, Team Name, Captain Name, Mobile).'
      });
    }

    const registered = registerVillageTeam({
      taluka,
      association,
      villageName,
      teamName,
      captainName,
      captainMobile,
      captainEmail: captainEmail || `${teamName.toLowerCase().replace(/\s+/g, '')}@villageleague.in`,
      paymentMethod: paymentMethod || 'UPI (PhonePe / GPay)',
      paymentScreenshotUrl,
      players: players || []
    });

    res.status(201).json({
      success: true,
      message: 'Village Team registered successfully for Village Premium League (500 Rs)!',
      team: registered
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});


