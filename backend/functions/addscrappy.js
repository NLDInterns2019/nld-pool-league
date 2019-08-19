const moment = require("moment")
//add a value to scrappy when the topPlayer has not changed

module.exports = {
  calculateScrappy: function(topPlayer, player1, player2, hof) {
    if (player1 === topPlayer && hof.staffName != topPlayer) {
      hof.scrappyPlays++;
      if (score2 > score1) {
        hof.scrappy++;
      }
    } else if (player2 === topPlayer && hof.staffName != topPlayer) {
      hof.scrappyPlays++;
      if (score1 > score2) {
        hof.scrappy++;
      }
    }
    return hof;
  }
}