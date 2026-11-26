import { Router } from 'express';
import {
  addScoredBall,
  undoLastScoredBall,
  swapMatchStrike,
  setMatchBowler,
  refreshMatchSnapshot
} from '../store.ts';
import { getSocketIO } from '../socket.ts';

export const adminRouter = Router();

// POST /api/v1/admin/matches/:id/balls
adminRouter.post('/matches/:id/balls', (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const ballInput = req.body;

  const { ball, state } = addScoredBall(matchId, ballInput);

  // Broadcast to WebSockets!
  const io = getSocketIO();
  if (io) {
    // To match subscribers
    io.to(`match:${matchId}`).emit('ball:new', {
      matchId,
      ball,
      state,
      version: state.version
    });

    // To lobby score strip subscribers
    io.to('lobby').emit('lobby:score', {
      matchId,
      teamA: { shortName: 'IND', score: '186/5 (20.0)' },
      teamB: {
        shortName: 'AUS',
        score: `${state.currentInnings?.runs}/${state.currentInnings?.wickets} (${state.currentInnings?.oversDisplay})`
      },
      status: state.status,
      statusNote: state.statusNote
    });
  }

  res.status(201).json({ success: true, ball, state });
});

// DELETE /api/v1/admin/matches/:id/balls/last
adminRouter.delete('/matches/:id/balls/last', (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const updatedState = undoLastScoredBall(matchId);

  const io = getSocketIO();
  if (io) {
    io.to(`match:${matchId}`).emit('ball:undo', {
      matchId,
      state: updatedState,
      version: updatedState.version
    });

    io.to('lobby').emit('lobby:score', {
      matchId,
      teamA: { shortName: 'IND', score: '186/5 (20.0)' },
      teamB: {
        shortName: 'AUS',
        score: `${updatedState.currentInnings?.runs}/${updatedState.currentInnings?.wickets} (${updatedState.currentInnings?.oversDisplay})`
      },
      status: updatedState.status,
      statusNote: updatedState.statusNote
    });
  }

  res.json({ success: true, state: updatedState });
});

// POST /api/v1/admin/matches/:id/swap-strike
adminRouter.post('/matches/:id/swap-strike', (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const updatedState = swapMatchStrike(matchId);

  const io = getSocketIO();
  if (io) {
    io.to(`match:${matchId}`).emit('match:snapshot', updatedState);
  }

  res.json({ success: true, state: updatedState });
});

// POST /api/v1/admin/matches/:id/next-bowler
adminRouter.post('/matches/:id/next-bowler', (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const { bowlerId } = req.body;
  const updatedState = setMatchBowler(matchId, parseInt(bowlerId, 10));

  const io = getSocketIO();
  if (io) {
    io.to(`match:${matchId}`).emit('match:snapshot', updatedState);
  }

  res.json({ success: true, state: updatedState });
});
