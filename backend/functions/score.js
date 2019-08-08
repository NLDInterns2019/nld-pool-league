const moment = require("moment")

module.exports = {
  calculateScore: function(player1, player2, score1, score2, dueDate) {
    let p1FormArray = player1.form.split("");
    p1FormArray.pop() //Remove oldest game
    let p2FormArray = player2.form.split("");
    p2FormArray.pop() //Remove oldest game

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
      p1FormArray.unshift("W")
      player2.lose++;
      p2FormArray.unshift("L")
    } else if (score1 < score2) {
      player1.lose++;
      p1FormArray.unshift("L")
      player2.win++;
      p2FormArray.unshift("W")
    } else {
      player1.draw++;
      p1FormArray.unshift("D")
      player2.draw++;
      p2FormArray.unshift("D")
    }

    //Update form
    player1.form = p1FormArray.join("");
    player2.form = p2FormArray.join("");

    //Calculate punctuality
    if(moment().isSameOrBefore(dueDate)){
      player1.punctuality++;
      player2.punctuality++;
    }else{
      player1.punctuality--;
      player2.punctuality--;
    }

    //Calculate score
    player1.points = player1.win * 3 + player1.draw;
    player2.points = player2.win * 3 + player2.draw;

    return { player1, player2 };
  }
};
