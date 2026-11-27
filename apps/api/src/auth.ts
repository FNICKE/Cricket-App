import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { dbPool } from './db.ts';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: 'super_admin' | 'scorer';
}

interface TokenPayload {
  subjectId: number;
  subjectType: 'admin' | 'player';
  exp: number;
}

const configuredTokenSecret = process.env.AUTH_SECRET;
const tokenSecret = configuredTokenSecret || randomBytes(32).toString('hex');
const tokenLifetimeSeconds = 8 * 60 * 60;

if (process.env.NODE_ENV === 'production'
  && (!configuredTokenSecret || configuredTokenSecret.length < 32)) {
  throw new Error('AUTH_SECRET must contain at least 32 characters in production.');
}

function createToken(subjectType: TokenPayload['subjectType'], subjectId: number): string {
  const payload: TokenPayload = {
    subjectId,
    subjectType,
    exp: Math.floor(Date.now() / 1000) + tokenLifetimeSeconds
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', tokenSecret).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function readToken(token: string): TokenPayload | null {
  const [encodedPayload, providedSignature, extra] = token.split('.');
  if (!encodedPayload || !providedSignature || extra) return null;

  const expectedSignature = createHmac('sha256', tokenSecret).update(encodedPayload).digest();
  let actualSignature: Buffer;
  try {
    actualSignature = Buffer.from(providedSignature, 'base64url');
  } catch {
    return null;
  }
  if (actualSignature.length !== expectedSignature.length
    || !timingSafeEqual(actualSignature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString()) as TokenPayload;
    if (!Number.isInteger(payload.subjectId) || payload.subjectId <= 0
      || !['admin', 'player'].includes(payload.subjectType)
      || !Number.isInteger(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function issueAdminToken(userId: number): string {
  return createToken('admin', userId);
}

export function issuePlayerToken(playerId: number): string {
  return createToken('player', playerId);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const payload = match ? readToken(match[1]) : null;
  if (!payload || payload.subjectType !== 'admin') {
    return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
  }

  dbPool.query(
    `SELECT id, email, full_name AS "fullName", role
     FROM admin_users WHERE id = $1 AND is_active = TRUE`,
    [payload.subjectId]
  ).then(({ rows }) => {
    if (!rows[0]) {
      return res.status(401).json({ success: false, message: 'This account is inactive.' });
    }
    res.locals.adminUser = rows[0] as AdminUser;
    next();
  }).catch((error: unknown) => {
    console.error('Admin authentication lookup failed:', error);
    res.status(503).json({ success: false, message: 'Authentication service is unavailable.' });
  });
}

export function requireRoles(...roles: AdminUser['role'][]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.adminUser as AdminUser | undefined;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to do this.' });
    }
    next();
  };
}

export function requirePlayerAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const payload = match ? readToken(match[1]) : null;
  if (!payload || payload.subjectType !== 'player') {
    return res.status(401).json({ success: false, message: 'Please sign in as a player.' });
  }
  res.locals.playerId = payload.subjectId;
  next();
}

export function requirePlayerOwnership(req: Request, res: Response, next: NextFunction) {
  const playerId = Number(req.params.id);
  if (!Number.isInteger(playerId) || playerId !== res.locals.playerId) {
    return res.status(403).json({ success: false, message: 'You can only access your own player account.' });
  }
  next();
}
