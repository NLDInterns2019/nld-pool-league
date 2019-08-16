const moment = require("moment")

module.exports = {
  calcWinDraw: function(score, oppScore, hof) {
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

    //calc for ach:topPlayer and ach:drawRate
    hof.winRate = (hof.wins * 100) / hof.plays;
    hof.drawRate = (hof.draws * 100) / hof.plays;

    return hof;
  }
}