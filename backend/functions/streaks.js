 const moment = require("moment")

module.exports = {
  calculateStreaks: function(fixtures,  hofAll) {
    let player1, player2 = 0;

    //now go through fixtures: needed for scrappy and streak calculations
    for (let i = 0; i < fixtures.length; i++) {

      //get the locations of the players from the main HoF table
      for (let j = 0; j < hofAll.length; j++) {
        if (hofAll[j].staffName == fixtures[i].player1) {
          player1 = j;
        } else if (hofAll[j].staffName == fixtures[i].player2) {
        player2 = j;
        } //TODO can't break because that gives a sexy little error
      }

      console.log(fixtures[i].player1 + " vs " + fixtures[i].player2)
      /////////////////////////////////////////////////////////////////////////   LONGEST LOSING/STREAK
      //update streak or reset as necessary. scrappyRate: streak temp. winRate: losingStreak temp.
      //draws do not break streak, but also do not add to it
      if (fixtures[i].score1 > fixtures[i].score2) { //check which player won
        console.log(fixtures[i].score1 + " is greater than " + fixtures[i].score2)
        hofAll[player1].curStreak++;
        hofAll[player2].curLosingStreak++;
        if (hofAll[player1].curStreak > hofAll[player1].streak) { //check if current winningStreak is their best
          console.log(hofAll[player1].curStreak + " is bigger than " + hofAll[player1].streak)
          hofAll[player1].winningStreak = hofAll[player1].curStreak; 
        }
        if (hofAll[player2].curLosingStreak > hofAll[player2].losingStreak) { //check if current losing streak is their best
          console.log(hofAll[player2].curLosingStreak + " is bigger than " + hofAll[player2].losingStreak)
          hofAll[player2].losingStreak = hofAll[player2].curLosingStreak; //around here?
        }
        hofAll[player2].curStreak = 0; 
        hofAll[player1].curLosingStreak = 0; 
      } else if (fixtures[i].score2 > fixtures[i].score1) {
        console.log(fixtures[i].score2 + " is bigger than " + fixtures[i].score1)
        hofAll[player2].curStreak++;
        if (hofAll[player2].curStreak > hofAll[player2].winningStreak) {
          console.log(hofAll[player2].curStreak + " is bigger than " + hofAll[player2].winningStreak)
          hofAll[player2].winningStreak = hofAll[player2].curStreak;
        }
        if (hofAll[player1].curLosingStreak > hofAll[player1].losingStreak) { 
          console.log(hofAll[player1].curLosingStreak + " is bigger than " + hofAll[player1].losingStreak)
          hofAll[player1].losingStreak = hofAll[player1].curLosingStreak; 
        }
        hofAll[player1].curStreak = 0;
        hofAll[player2].curLosingStreak = 0; //reset opponents
      }
    }
    return hofAll;
  }
 }