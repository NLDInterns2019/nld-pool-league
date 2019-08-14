const moment = require("moment")

module.exports = {
  calculateScrappy: function(fixtures, topPlayer, hofAll, i) {
    let player1, player2 = 0;
    for (let i = 0; i < fixtures.length; i++) {
      console.log("match: " + fixtures[i].player1 + " vs " + fixtures[i].player2)
      for (let j = 0; j < hofAll.length; j++) {
        if (hofAll[j].staffName == fixtures[i].player1) {
          player1 = j;
        } else if (hofAll[j].staffName == fixtures[i].player2) {
          player2 = j;
        } 
      }
      console.log(hofAll[player1].staffName + " " + hofAll[player2].staffName)
    
    if (fixtures[i].player1 == topPlayer) { //check if the top player played in the fixture
      console.log([fixtures[i].player1 + " vs " + topPlayer])
      hofAll[player2].scrappyPlays = hofAll[player2].scrappyPlays + 1; //if so, increment suitably
      if (parseInt(fixtures[i].score2) > parseInt(fixtures[i].score1)) {
        console.log(fixtures[i].score2 + " is bigger than " + fixtures[i].score1)
        console.log(hofAll[player2].staffName + " won against " + topPlayer)
        hofAll[player2].scrappy++; //if so, increment suitably
      }
    } else if (fixtures[i].player2 == topPlayer)  {
      console.log([fixtures[i].player2 + " vs " + topPlayer])
      hofAll[player1].scrappyPlays = hofAll[player2].scrappyPlays + 1; //if so, increment suitably
      if (parseInt(fixtures[i].score1) > parseInt(fixtures[i].score2)) {
        console.log(fixtures[i].score1 + " is bigger than " + fixtures[i].score2)
        console.log(hofAll[player1].staffName + " won against " + topPlayer)
        hofAll[player1].scrappy++; //if so, increment suitably
      }
    }
    }
    
    for (let i = 0; i < hofAll.length; i++) {
      hofAll[i].scrappyRate = Math.trunc(
        (hofAll[i].scrappy * 100) / hofAll[i].scrappyPlays
      );
      hofAll[i].improvement = Math.trunc((hofAll[i].improvement * 100) / 2); 
    }
    return hofAll;
  }
}