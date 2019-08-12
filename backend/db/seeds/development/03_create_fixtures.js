
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('eight_nine_ball_fixtures').del()
    .then(function () {
      // Inserts seed entries
      return knex('eight_nine_ball_fixtures').insert([
        {type: 8, seasonId: 1, player1: 'One', player2: 'Two', score1: 2, score2: 0},
        {type: 8, seasonId: 1, player1: 'One', player2: 'Three', score1: 0, score2: 2},
        {type: 8, seasonId: 1, player1: 'Two', player2: 'Three', score1: 1, score2: 1},

        {type: 8, seasonId: 2, player1: 'One', player2: 'Two', score1: 2, score2: 0},
        {type: 8, seasonId: 2, player1: 'One', player2: 'Three', score1: 0, score2: 2},
        {type: 8, seasonId: 2, player1: 'Two', player2: 'Three', score1: 1, score2: 1},

        {type: 8, seasonId: 3, player1: 'One', player2: 'Two', score1: 2, score2: 0},
        {type: 8, seasonId: 3, player1: 'One', player2: 'Three', score1: 2, score2: 0},
        {type: 8, seasonId: 3, player1: 'Two', player2: 'Three', score1: 1, score2: 1},
        
        /*{type: 8, seasonId: 24, player1: 'MAL', player2: 'WILKA', score1: 1, score2: 1}, //1
        {type: 8, seasonId: 24, player1: 'ANDY', player2: 'PAUL', score1: 2, score2: 0},
        {type: 8, seasonId: 24, player1: 'DAVIDT', player2: 'DREW', score1: 1, score2: 1},
        {type: 8, seasonId: 24, player1: 'IANR', player2: 'CHRIS', score1: 1, score2: 1},

        {type: 8, seasonId: 24, player1: 'PAUL', player2: 'WILKA', score1: 1, score2: 1},
        {type: 8, seasonId: 24, player1: 'IANR', player2: 'MAL', score1: 1, score2: 1}, //2
        {type: 8, seasonId: 24, player1: 'ANDY', player2: 'DREW', score1: 0, score2: 2},
        {type: 8, seasonId: 24, player1: 'DAVIDT', player2: 'CHRIS', score1: 1, score2: 1},

        {type: 8, seasonId: 24, player1: 'DREW', player2: 'WILKA', score1: 0, score2: 2}, //3
        {type: 8, seasonId: 24, player1: 'PAUL', player2: 'MAL', score1: 2, score2: 0},
        {type: 8, seasonId: 24, player1: 'ANDY', player2: 'CHRIS', score1: 1, score2: 1},
        {type: 8, seasonId: 24, player1: 'IANR', player2: 'DAVIDT', score1: 1, score2: 1},
        
        {type: 8, seasonId: 24, player1: 'CHRIS', player2: 'WILKA', score1: 2, score2: 0}, //4
        {type: 8, seasonId: 24, player1: 'DREW', player2: 'MAL', score1: 0, score2: 2},
        {type: 8, seasonId: 24, player1: 'IANR', player2: 'PAUL', score1: 1, score2: 1},
        {type: 8, seasonId: 24, player1: 'ANDY', player2: 'DAVIDT', score1: 0, score2: 2},
        
        {type: 8, seasonId: 24, player1: 'DAVIDT', player2: 'WILKA', score1: 2, score2: 0},
        {type: 8, seasonId: 24, player1: 'CHRIS', player2: 'MAL', score1: 0, score2: 2}, //5
        {type: 8, seasonId: 24, player1: 'DREW', player2: 'PAUL', score1: 2, score2: 0},
        {type: 8, seasonId: 24, player1: 'IANR', player2: 'ANDY', score1: 0, score2: 2},
        
        {type: 8, seasonId: 24, player1: 'ANDY', player2: 'WILKA', score1: 1, score2: 1},
        {type: 8, seasonId: 24, player1: 'DAVIDT', player2: 'MAL', score1: 0, score2: 2}, //6
        {type: 8, seasonId: 24, player1: 'CHRIS', player2: 'PAUL', score1: 0, score2: 2},
        {type: 8, seasonId: 24, player1: 'IANR', player2: 'DREW', score1: 1, score2: 1},
        
        {type: 8, seasonId: 24, player1: 'IANR', player2: 'WILKA', score1: 1, score2: 1},
        {type: 8, seasonId: 24, player1: 'ANDY', player2: 'MAL', score1: 1, score2: 1}, //7
        {type: 8, seasonId: 24, player1: 'DAVIDT', player2: 'PAUL', score1: 1, score2: 1},
        {type: 8, seasonId: 24, player1: 'CHRIS', player2: 'DREW', score1: 2, score2: 0},

        
        {type: 8, seasonId: 25, player1: 'ANDY', player2: 'MAL', score1: 2, score2: 0}, //7
        {type: 8, seasonId: 25, player1: 'MAL', player2: 'CHRISP', score1: 1, score2: 1},
        {type: 8, seasonId: 25, player1: 'ANDY', player2: 'CHRISP', score1: 2, score2: 0},*/
      ]);
    });
};
