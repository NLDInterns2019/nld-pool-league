module.exports = {
    //calculate fixture values
    fixtureCalc: function (currentLeague, players, seasonId, group, date) {
       let currentWinRate, totalWins, totalPlays, totalPoints = 0;
       let present = false;

      //calculate winrate for the current league
      currentWinRate =
      (currentLeague[loc].win * 100) / currentLeague[loc].play;

    totalWins = 0;
    totalPlays = 0;
    totalPoints = 0;
    let present = false;

    //count relevant data for past leagues
    for (let i = 0; i < pastLeagues.length; i++) {
      if (pastLeagues[i].staffName === hofAll[j].staffName) {
        present = true;
        totalWins = totalWins + pastLeagues[i].win;
        totalPlays = totalPlays + pastLeagues[i].play;
        totalPoints = totalPoints + pastLeagues[i].points;
      }
    }

    //if user has past league matches, calculate their improvement. if not, set it to 0.
    if (present === true) {
      //calculate the winrate of the past leagues hofAll.improvement = oldWinRate
      oldWinRate = (totalWins * 100) / totalPlays;

      //get % increase/decrease
      hofAll[j].improvement = currentWinRate - oldWinRate;
    } else {
      hofAll[j].improvement = 0;
    }

    //get avg points per season
    hofAll[j].avgPointsSeason = totalPoints / seasons.length;
    }
}