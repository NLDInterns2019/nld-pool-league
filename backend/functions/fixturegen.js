module.exports = {
    //calculate fixture values
    fixtureCalc: function (players, seasonId, group) {
        let offset = 2;
        playerCount = players.length;
        fixture = [];
        for (var i = 0; i<playerCount/2-1; i++) { //this represents fixture rows. batch insert these. //was /2-1
            fixture = [...fixture, ({
              seasonId: seasonId,
              player1: players[i].staffName,
              player2: players[players.length-i-offset].staffName,
              group: group
            })];
          }
          if (playerCount%2==0) {
          fixture = [...fixture, ({
            seasonId: seasonId,
            player1: players[playerCount-1].staffName,
              player2: players[players.length/2-1].staffName,
              group: group
             })]
          }
          return fixture;
    }
}