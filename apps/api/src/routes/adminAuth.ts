import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { dbPool } from '../db.ts';
import { getHomeData, getPlayerRegistrations } from '../store.ts';
import { issueAdminToken, requireAuth, requireRoles, type AdminUser } from '../auth.ts';

export const adminAuthRouter = Router();

export async function initializeAdminAuth() {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id BIGSERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'scorer',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);

  const { rows: existingAdmins } = await dbPool.query(
    `SELECT id FROM admin_users WHERE role = 'super_admin' LIMIT 1`
  );
  if (existingAdmins.length > 0) return;

  const email = (process.env.BOOTSTRAP_ADMIN_EMAIL
    || (process.env.NODE_ENV === 'production' ? '' : 'admin@cricket.local')).trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD
    || (process.env.NODE_ENV === 'production' ? '' : 'Password123!');
  if (!email || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('Set BOOTSTRAP_ADMIN_EMAIL and a BOOTSTRAP_ADMIN_PASSWORD between 12 and 72 bytes.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows: createdAdmins } = await dbPool.query(
    `INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
     VALUES ($1, $2, 'Super Administrator', 'super_admin', TRUE)
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    [email, passwordHash]
  );
  if (createdAdmins.length === 0) {
    throw new Error(`Could not bootstrap super administrator ${email}; that email is already in use.`);
  }
  console.log(`[Auth] Created initial super administrator: ${email}`);
}

adminAuthRouter.post('/login', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!email || !password || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ success: false, message: 'Enter your email and password.' });
  }

  try {
    const { rows } = await dbPool.query(
      `SELECT id, email, password_hash, full_name AS "fullName", role
       FROM admin_users WHERE LOWER(email) = $1 AND is_active = TRUE`,
      [email]
    );
    const account = rows[0];
    if (!account || !(await bcrypt.compare(password, account.password_hash))) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    }
    if (!['super_admin', 'scorer'].includes(account.role)) {
      return res.status(403).json({ success: false, message: 'This account cannot access the scorer desk.' });
    }

    const user: AdminUser = {
      id: Number(account.id),
      email: account.email,
      fullName: account.fullName,
      role: account.role
    };
    return res.json({ success: true, token: issueAdminToken(user.id), user });
  } catch (error) {
    console.error('Admin login failed:', error);
    return res.status(503).json({ success: false, message: 'Authentication service is unavailable.' });
  }
});

adminAuthRouter.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, user: res.locals.adminUser });
});

adminAuthRouter.get('/overview', requireAuth, requireRoles('super_admin'), async (_req, res) => {
  try {
    const { rows: scorers } = await dbPool.query(
      `SELECT id, email, full_name AS "fullName", role, is_active AS "isActive", created_at AS "createdAt"
       FROM admin_users WHERE role = 'scorer' ORDER BY created_at DESC`
    );
    const registrations = getPlayerRegistrations();
    return res.json({
      success: true,
      matches: getHomeData().scoreStrip,
      scorers,
      registrations: {
        total: registrations.length,
        paid: registrations.filter((registration) => registration.paymentStatus === 'paid').length,
        pending: registrations.filter((registration) => registration.paymentStatus === 'pending').length,
        expired: registrations.filter((registration) => registration.isExpired).length
      }
    });
  } catch (error) {
    console.error('Super-admin overview failed:', error);
    return res.status(503).json({ success: false, message: 'Could not load the admin overview.' });
  }
});

adminAuthRouter.post('/scorers', requireAuth, requireRoles('super_admin'), async (req, res) => {
  const fullName = typeof req.body?.fullName === 'string' ? req.body.fullName.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!fullName || fullName.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || email.length > 255 || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({
      success: false,
      message: 'Enter a name, valid email, and password between 12 and 72 bytes.'
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await dbPool.query(
      `INSERT INTO admin_users (email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, 'scorer', TRUE)
       RETURNING id, email, full_name AS "fullName", role, is_active AS "isActive", created_at AS "createdAt"`,
      [email, passwordHash, fullName]
    );
    return res.status(201).json({ success: true, scorer: rows[0] });
  } catch (error: any) {
    if (error?.code === '23505') {
      return res.status(409).json({ success: false, message: 'An account already uses this email.' });
    }
    console.error('Scorer account creation failed:', error);
    return res.status(503).json({ success: false, message: 'Could not create the scorer account.' });
  }
});
