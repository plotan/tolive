import express from 'express';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

import TikTokService from './services/TikTokService.js';
import GameService from './services/GameService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 1337;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'guess.html'));
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('🔌 New client connected');
  
  // Send initial connected message
  ws.send(JSON.stringify({ 
    type: 'connected',
    leaderboard: GameService.getLeaderboard() // Send initial leaderboard
  }));

  // Broadcast to all clients
  const broadcast = (data) => {
    wss.clients.forEach(client => {
      client.send(JSON.stringify(data));
    });
  };

  // Setup game event handlers
  GameService.on('newRound', (data) => {
    broadcast({ type: 'newRound', ...data });
  });

  GameService.on('correctAnswer', (data) => {
    broadcast({ type: 'correctAnswer', ...data });
  });
});

// Start the server and connect to TikTok
server.listen(PORT, async () => {
  console.log(`🎮 Game server running at http://localhost:${PORT}`);
  
  try {
    await TikTokService.connect();
    
    // Set up TikTok chat handler after connection
    TikTokService.on('chat', ({ username, message }) => {
      GameService.checkAnswer(username, message);
    });
    
    GameService.startNewRound();
  } catch (err) {
    console.error('Failed to start game:', err);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  TikTokService.disconnect();
  server.close();
});