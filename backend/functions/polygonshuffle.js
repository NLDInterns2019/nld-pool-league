module.exports = {
    //shift values in an array
    polygonShuffle: function (players) {
        let offsets = 2;
        if (players.length % 2 > 0) {
          offsets = 1;
        }
        var playerCount = players.length-offsets;
        var firstValue = players[0];
        for (var i = 0; i<playerCount; i++) {
            players[i] = players[i+1];
        }
        players[playerCount] = firstValue;
        return players;
      }
    

    
  };
  