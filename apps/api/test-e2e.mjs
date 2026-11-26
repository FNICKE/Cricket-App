import http from 'http';

async function runTest() {
  console.log('[E2E Test] Starting API server...');
  const { matchesRouter } = await import('./src/routes/matches.ts');
  const { adminRouter } = await import('./src/routes/admin.ts');
  const { initSocketIO } = await import('./src/socket.ts');
  const express = (await import('express')).default;
  const cors = (await import('cors')).default;

  const app = express();
  const server = http.createServer(app);
  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use('/api/v1', matchesRouter);
  app.use('/api/v1/admin', adminRouter);

  initSocketIO(server);

  await new Promise((resolve) => server.listen(4005, resolve));
  console.log('[E2E Test] Test server listening on http://localhost:4005');

  try {
    // 1. Fetch live state before scoring
    const res1 = await fetch('http://localhost:4005/api/v1/matches/1/live');
    const state1 = await res1.json();
    const initRuns = state1.currentInnings.runs;
    const initBalls = state1.currentInnings.legalBalls;
    console.log(`[Before Ball] AUS: ${initRuns}/${state1.currentInnings.wickets} in ${state1.currentInnings.oversDisplay} ov, Target: 187`);

    // 2. Score a SIX off the bat by Maxwell!
    const postRes = await fetch('http://localhost:4005/api/v1/admin/matches/1/balls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runsBat: 6,
        isSix: true,
        commentary: 'Bumrah to Maxwell, SIX! Picked off the pads and dispatched over deep backward square leg!'
      })
    });
    const postData = await postRes.json();
    const state2 = postData.state;
    console.log(`[After SIX]   AUS: ${state2.currentInnings.runs}/${state2.currentInnings.wickets} in ${state2.currentInnings.oversDisplay} ov`);
    console.log(`[Recent Balls] ${state2.currentInnings.recentBalls.slice(-6).join(' ')}`);

    if (state2.currentInnings.runs !== initRuns + 6) {
      throw new Error(`Expected runs ${initRuns + 6}, got ${state2.currentInnings.runs}`);
    }
    if (state2.currentInnings.legalBalls !== initBalls + 1) {
      throw new Error(`Expected legalBalls ${initBalls + 1}, got ${state2.currentInnings.legalBalls}`);
    }

    // 3. Test UNDO
    const undoRes = await fetch('http://localhost:4005/api/v1/admin/matches/1/balls/last', {
      method: 'DELETE'
    });
    const undoData = await undoRes.json();
    const state3 = undoData.state;
    console.log(`[After UNDO]  AUS: ${state3.currentInnings.runs}/${state3.currentInnings.wickets} in ${state3.currentInnings.oversDisplay} ov`);

    if (state3.currentInnings.runs !== initRuns) {
      throw new Error(`Undo failed: expected ${initRuns}, got ${state3.currentInnings.runs}`);
    }

    console.log('\n✅ ALL END-TO-END CRICKET SCORING TESTS PASSED PERFECTLY!');
  } finally {
    server.close();
  }
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
