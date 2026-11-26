// =====================================================================
// MAIN API SERVER
// =====================================================================

import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { matchesRouter } from './routes/matches.ts';
import { adminRouter } from './routes/admin.ts';
import { initSocketIO } from './socket.ts';
import { checkDatabaseConnection } from './db.ts';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/v1', matchesRouter);
app.use('/api/v1/admin', adminRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Cricket Live API'
  });
});

// Initialize WebSockets
initSocketIO(server);

const PORT = parseInt(process.env.PORT || '4000', 10);

server.listen(PORT, async () => {
  console.log(`[API] Server listening on http://localhost:${PORT}`);
  console.log(`[API] Socket.IO real-time engine ready.`);
  console.log(`[API] All 10 Pages & Village League API Ready.`);
  // Attempt to check PostgreSQL connection
  await checkDatabaseConnection();
});
