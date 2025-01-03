import gameState from '../models/gameState.js';
import { getRandomWord } from '../data/wordList.js';
import CONFIG from '../config.js';
import { EventEmitter } from 'events';

class GameService extends EventEmitter {
  constructor() {
    super();
    this.currentRound = null;
  }

  startNewRound() {
    const newWord = getRandomWord();
    gameState.setCurrentWord(newWord.word, newWord.clue);
    this.emit('newRound', { clue: newWord.clue });
    console.log(`🎮 New round started! Word: ${newWord.word} (${newWord.clue})`);
  }

  checkAnswer(username, answer) {
    const isCorrect = gameState.checkAnswer(username, answer);
    if (isCorrect) {
      console.log(`🎯 ${username} got the correct answer!`);
      
      // Emit both the correct answer and updated leaderboard
      this.emit('correctAnswer', { 
        username,
        leaderboard: gameState.getTopPlayers()
      });
      
      setTimeout(() => this.startNewRound(), CONFIG.nextQuestionDelay);
    }
    return isCorrect;
  }

  getLeaderboard() {
    return gameState.getTopPlayers();
  }
}

export default new GameService();