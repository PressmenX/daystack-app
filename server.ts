import express, { type NextFunction, type Request, type Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

interface RoutineRecord {
  id: string;
  user_id: string;
  name: string;
  kind: 'global';
  mode: 'checklist';
  start_time: string | null;
  created_at: string;
}

interface ActivityRecord {
  id: string;
  routine_id: string;
  user_id: string;
  name: string;
  start_time: string | null;
  is_completed: boolean;
  position: number;
  created_at: string;
}

interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

const PORT = 3000;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
const MAX_ACTIVITY_NAME = 120;
const MIN_PASSWORD_LEN = 6;

const usersById = new Map<string, UserRecord>();
const usersByEmail = new Map<string, UserRecord>();
const routinesByUserId = new Map<string, RoutineRecord>();
const activitiesById = new Map<string, ActivityRecord>();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    return false;
  }
  const [salt, keyHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(keyHex, 'hex');
  if (derived.length !== storedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(derived, storedBuffer);
}

function signToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ sub: userId, exp: Date.now() + TOKEN_TTL_MS }),
    'utf8'
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }
  const [payload, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  const sigBuf = Buffer.from(sig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub?: unknown;
      exp?: unknown;
    };
    if (typeof parsed.sub !== 'string' || typeof parsed.exp !== 'number') {
      return null;
    }
    if (Date.now() > parsed.exp) {
      return null;
    }
    return parsed.sub;
  } catch {
    return null;
  }
}

function getSessionCookie(req: Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }
  const match = cookieHeader
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith('daystack_session='));
  if (!match) {
    return null;
  }
  return decodeURIComponent(match.slice(match.indexOf('=') + 1));
}

function setSessionCookie(res: Response, token: string): void {
  res.setHeader(
    'Set-Cookie',
    `daystack_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_TTL_MS / 1000}`
  );
}

function clearSessionCookie(res: Response): void {
  res.setHeader(
    'Set-Cookie',
    'daystack_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );
}

function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const token = bearerToken || getSessionCookie(req);
  if (!token) {
    res.status(401).json({ error: 'Sesi tidak valid atau telah berakhir.' });
    return;
  }
  const userId = verifyToken(token);
  if (!userId) {
    res.status(401).json({ error: 'Sesi tidak valid atau telah berakhir.' });
    return;
  }
  const user = usersById.get(userId);
  if (!user) {
    res.status(401).json({ error: 'Pengguna tidak ditemukan.' });
    return;
  }
  req.user = user;
  next();
}

function getOrCreateGlobalRoutine(userId: string): RoutineRecord {
  const existing = routinesByUserId.get(userId);
  if (existing) {
    return existing;
  }
  const routine: RoutineRecord = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: 'Global Routines',
    kind: 'global',
    mode: 'checklist',
    start_time: null,
    created_at: new Date().toISOString(),
  };
  routinesByUserId.set(userId, routine);
  return routine;
}

function getUserActivities(routineId: string, userId: string): ActivityRecord[] {
  return Array.from(activitiesById.values())
    .filter((item) => item.routine_id === routineId && item.user_id === userId)
    .sort((a, b) => a.position - b.position);
}

function normalizeStartTime(raw: unknown): string | null | undefined {
  if (raw === null || raw === undefined || raw === '') {
    return null;
  }
  if (typeof raw !== 'string') {
    return undefined;
  }
  const trimmed = raw.trim();
  if (!TIME_PATTERN.test(trimmed)) {
    return undefined;
  }
  return trimmed.length === 5 ? `${trimmed}:00` : trimmed;
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const body = req.body as { email?: unknown; password?: unknown; name?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const rawName = typeof body.name === 'string' ? body.name.trim() : '';

    if (!EMAIL_PATTERN.test(email)) {
      res.status(400).json({ error: 'Format email tidak valid.' });
      return;
    }
    if (password.length < MIN_PASSWORD_LEN) {
      res.status(400).json({ error: `Kata sandi minimal ${MIN_PASSWORD_LEN} karakter.` });
      return;
    }
    if (usersByEmail.has(email)) {
      res.status(409).json({ error: 'Email sudah terdaftar.' });
      return;
    }

    const derivedName = rawName || email.split('@')[0] || 'Pengguna';
    const user: UserRecord = {
      id: crypto.randomUUID(),
      email,
      name: derivedName.slice(0, 60),
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    usersById.set(user.id, user);
    usersByEmail.set(user.email, user);
    getOrCreateGlobalRoutine(user.id);

    const token = signToken(user.id);
    setSessionCookie(res, token);
    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const body = req.body as { email?: unknown; password?: unknown };
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!EMAIL_PATTERN.test(email) || !password) {
      res.status(400).json({ error: 'Email dan kata sandi wajib diisi.' });
      return;
    }
    const user = usersByEmail.get(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: 'Email atau kata sandi salah.' });
      return;
    }
    getOrCreateGlobalRoutine(user.id);
    const token = signToken(user.id);
    setSessionCookie(res, token);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  });

  app.get('/api/auth/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  });

  app.post('/api/auth/logout', (_req: Request, res: Response) => {
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  app.get('/api/routines/global', authenticate, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const routine = getOrCreateGlobalRoutine(user.id);
    const activities = getUserActivities(routine.id, user.id);
    res.json({ routine, activities });
  });

  app.post('/api/activities', authenticate, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const body = req.body as { name?: unknown; start_time?: unknown };
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const startTime = normalizeStartTime(body.start_time);

    if (!name || name.length > MAX_ACTIVITY_NAME) {
      res.status(400).json({ error: 'Nama aktivitas wajib diisi (maksimal 120 karakter).' });
      return;
    }
    if (startTime === undefined) {
      res.status(400).json({ error: 'Format jam mulai tidak valid.' });
      return;
    }

    const routine = getOrCreateGlobalRoutine(user.id);
    const current = getUserActivities(routine.id, user.id);
    const nextPosition = current.length > 0 ? current[current.length - 1].position + 1 : 0;

    const activity: ActivityRecord = {
      id: crypto.randomUUID(),
      routine_id: routine.id,
      user_id: user.id,
      name,
      start_time: startTime,
      is_completed: false,
      position: nextPosition,
      created_at: new Date().toISOString(),
    };
    activitiesById.set(activity.id, activity);
    res.status(201).json({ activity });
  });

  app.patch('/api/activities/reorder', authenticate, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const body = req.body as { orderedIds?: unknown };
    if (!Array.isArray(body.orderedIds) || body.orderedIds.some((id) => typeof id !== 'string')) {
      res.status(400).json({ error: 'Daftar urutan aktivitas tidak valid.' });
      return;
    }

    const routine = getOrCreateGlobalRoutine(user.id);
    const owned = getUserActivities(routine.id, user.id);
    const ownedIds = new Set(owned.map((item) => item.id));
    const orderedIds = body.orderedIds as string[];

    if (orderedIds.length !== ownedIds.size || orderedIds.some((id) => !ownedIds.has(id))) {
      res.status(400).json({ error: 'Daftar aktivitas tidak sesuai dengan data pengguna.' });
      return;
    }

    orderedIds.forEach((id, index) => {
      const existing = activitiesById.get(id);
      if (existing && existing.user_id === user.id) {
        activitiesById.set(id, { ...existing, position: index });
      }
    });

    const updated = getUserActivities(routine.id, user.id);
    res.json({ activities: updated });
  });

  app.patch('/api/activities/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const activity = activitiesById.get(req.params.id);
    if (!activity || activity.user_id !== user.id) {
      res.status(404).json({ error: 'Aktivitas tidak ditemukan.' });
      return;
    }

    const body = req.body as {
      name?: unknown;
      start_time?: unknown;
      is_completed?: unknown;
    };

    let nextName = activity.name;
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || !body.name.trim() || body.name.trim().length > MAX_ACTIVITY_NAME) {
        res.status(400).json({ error: 'Nama aktivitas wajib diisi (maksimal 120 karakter).' });
        return;
      }
      nextName = body.name.trim();
    }

    let nextStartTime = activity.start_time;
    if (body.start_time !== undefined) {
      const parsedTime = normalizeStartTime(body.start_time);
      if (parsedTime === undefined) {
        res.status(400).json({ error: 'Format jam mulai tidak valid.' });
        return;
      }
      nextStartTime = parsedTime;
    }

    let nextCompleted = activity.is_completed;
    if (body.is_completed !== undefined) {
      if (typeof body.is_completed !== 'boolean') {
        res.status(400).json({ error: 'Status selesai tidak valid.' });
        return;
      }
      nextCompleted = body.is_completed;
    }

    const updated: ActivityRecord = {
      ...activity,
      name: nextName,
      start_time: nextStartTime,
      is_completed: nextCompleted,
    };
    activitiesById.set(activity.id, updated);
    res.json({ activity: updated });
  });

  app.delete('/api/activities/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const activity = activitiesById.get(req.params.id);
    if (!activity || activity.user_id !== user.id) {
      res.status(404).json({ error: 'Aktivitas tidak ditemukan.' });
      return;
    }
    activitiesById.delete(activity.id);

    const remaining = getUserActivities(activity.routine_id, user.id);
    remaining.forEach((item, index) => {
      activitiesById.set(item.id, { ...item, position: index });
    });

    res.json({ ok: true });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
