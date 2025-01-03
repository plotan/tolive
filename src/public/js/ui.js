class GameUI {
  static updateClue(clue) {
    document.getElementById('clue').textContent = `Clue: ${clue}`;
    document.getElementById('message').textContent = '';
  }

  static showCorrectAnswer(username) {
    const message = document.getElementById('message');
    message.textContent = `${username} got the correct answer!`;
    message.style.color = 'green';
  }

  static updateLeaderboard(players) {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = players
      .map(player => `<li>${player.rank}. ${player.username} - ${player.points} points</li>`)
      .join('');
  }
}

export default GameUI;
