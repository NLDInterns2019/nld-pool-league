module.exports = {
  calculateScore: function(player1, player2, score1, score2) {
    //Increment the play
    player1.play++;
    player2.play++;

    //Increment the for and againts
    player1.goalsFor = player1.goalsFor + score1;
    player1.goalsAgainst = player1.goalsAgainst + score2;

    player2.goalsFor = player2.goalsFor + score2;
    player2.goalsAgainst = player2.goalsAgainst + score1;

    //Find out who won
    if (score1 > score2) {
      player1.win++;
      player2.lose++;
    } else if (score1 < score2) {
      player1.lose++;
      player2.win++;
    } else {
      player1.draw++;
      player2.draw++;
    }

    //Calculate score
    player1.points = player1.win * 3 + player1.draw;
    player2.points = player2.win * 3 + player2.draw;

    return { player1, player2 };
  }
};
