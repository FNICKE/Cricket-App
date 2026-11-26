// =====================================================================
// REAL-TIME WEBSOCKET SERVER (SOCKET.IO)
// Sub-second score propagation from scorer to fans
// =====================================================================

import { Server as SocketIOServer } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { getMatchLive } from './store.ts';

let ioInstance: SocketIOServer | null = null;

export function initSocketIO(httpServer: HttpServer) {
  ioInstance = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  ioInstance.on('connection', (socket) => {
    // 1. Subscribe to a specific match room
    socket.on('match:subscribe', (data: { matchId: number }) => {
      const matchId = data?.matchId || 1;
      const room = `match:${matchId}`;
      socket.join(room);

      // Immediately return latest snapshot
      const currentSnapshot = getMatchLive(matchId);
      socket.emit('match:snapshot', currentSnapshot);
    });

    // 2. Unsubscribe
    socket.on('match:unsubscribe', (data: { matchId: number }) => {
      const matchId = data?.matchId || 1;
      socket.leave(`match:${matchId}`);
    });

    // 3. Lobby subscribe (for home score strip tickers)
    socket.on('lobby:subscribe', () => {
      socket.join('lobby');
    });
  });

  return ioInstance;
}

export function getSocketIO(): SocketIOServer | null {
  return ioInstance;
}
