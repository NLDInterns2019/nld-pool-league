

module.exports = {
  calcWinDraw: function(score, oppScore, hof, seasons) {
    //increment for ach:dedicated
    hof.plays++;
    
    //increment for ac:topPlayer
    if (score > oppScore) {
     hof.wins++;
    } else if (oppScore > score) {
      hof.loss++;
    } else {
      hof.draws++;
    }

    //add for ac:avgPoints
    hof.totalPoints = hof.totalPoints + score;

    hof.avgPointsSeason = hof.totalPoints/seasons;
    if (hof.plays > 0) {
      hof.avgPoints = hof.totalPoints/hof.plays;
    } else {
      hof.avgPoints = 0;
    }

    //calc for ach:topPlayer and ach:drawRate
    hof.winRate = (hof.wins * 100) / hof.plays;
    hof.drawRate = (hof.draws * 100) / hof.plays;

    return hof;
  }
}