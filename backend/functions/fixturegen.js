module.exports = {
  //calculate fixture values
  fixtureCalc: function(type, players, seasonId, group, date) {
    playerCount = players.length;
    fixture = [];
    for (var i = 0; i < playerCount / 2 - 1; i++) {
      //this represents fixture rows
      fixture = [
        ...fixture,
        {
          type: type,
          seasonId: seasonId,
          player1: players[i].staffName,
          player2: players[players.length - i - 2].staffName,
          group: group,
          date: date
        }
      ];
    }
    if (playerCount % 2 == 0) {
      //ʕ•ᴥ•ʔ hi
      fixture = [
        ...fixture,
        {
          type: type,
          seasonId: seasonId,
          player1: players[playerCount - 1].staffName,
          player2: players[players.length / 2 - 1].staffName,
          group: group,
          date: date
        }
      ];
    }
    return fixture;
  }
};
