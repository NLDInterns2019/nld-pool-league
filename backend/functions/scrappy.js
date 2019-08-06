const moment = require("moment")

module.exports = {
  calculateScrappy: function(fixtures, topPlayer, hofAll, player1, player2, i) {

    if (fixtures[i].player1 == topPlayer) { //check if the top player played in the fixture
        hofAll[player2].scrappyPlays = hofAll[player2].scrappyPlays + 1; //if so, increment suitably
        if (parseInt(fixtures[i].score2) > parseInt(fixtures[i].score1)) {
          hofAll[player2].scrappy++; //if so, increment suitably
        }
      } else if (fixtures[i].player2 == topPlayer)  {
        hofAll[player1].scrappyPlays = hofAll[player2].scrappyPlays + 1; //if so, increment suitably
        if (parseInt(fixtures[i].score1) > parseInt(fixtures[i].score2)) {
          hofAll[player1].scrappy++; //if so, increment suitably
        }
      }
      return hofAll;
  }
}