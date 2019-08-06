const moment = require("moment")

module.exports = {
  calculateScrappy: function(fixtures, topPlayer, hofAll, i) {
    let player1, player2 = 0;
    for (let j = 0; j < hofAll.length; j++) {
        if (hofAll[j].staffName == fixtures[i].player1) {
          player1 = j;
        } else if (hofAll[j].staffName == fixtures[i].player2) {
          player2 = j;
        } //TODO can't use break because that gives a sexy little error
      }

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