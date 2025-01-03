import GameUI from './ui.js';

const socket = new WebSocket(`ws://${window.location.host}`);

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'connected':
      console.log('✅ Connected to game server!');
      break;
    case 'newRound':
      GameUI.updateClue(data.clue);
      break;
    case 'correctAnswer':
      GameUI.showCorrectAnswer(data.username);
      // Update leaderboard when we receive correct answer
      if (data.leaderboard) {
        GameUI.updateLeaderboard(data.leaderboard);
      }
      break;
  }
};