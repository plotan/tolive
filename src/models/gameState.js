// Game state management
class GameState {
  constructor() {
    this.currentWord = null;
    this.leaderboard = new Map(); // username -> points
  }

  setCurrentWord(word, clue) {
    this.currentWord = { word: word.toLowerCase(), clue };
  }

  checkAnswer(username, answer) {
    if (!this.currentWord) return false;
    
    const isCorrect = answer.toLowerCase() === this.currentWord.word;
    if (isCorrect) {
      this.addPoint(username);
    }
    return isCorrect;
  }

  addPoint(username) {
    const currentPoints = this.leaderboard.get(username) || 0;
    this.leaderboard.set(username, currentPoints + 1);
  }

  getTopPlayers(limit = 7) { // Changed default limit to 7
    return Array.from(this.leaderboard.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([username, points], index) => ({
        rank: index + 1,
        username,
        points
      }));
  }
}

export default new GameState();
