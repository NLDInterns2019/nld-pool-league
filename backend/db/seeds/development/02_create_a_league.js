exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("eight_nine_ball_leagues")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("eight_nine_ball_leagues").insert([/*
        { type: 8, seasonId: 2019, staffName: "Michael" },
        { type: 8, seasonId: 2019, staffName: "Matthew" },
        { type: 8, seasonId: 2019, staffName: "Natalie" },
        { type: 8, seasonId: 2020, staffName: "Michael" },
        { type: 8, seasonId: 2020, staffName: "Matthew" },
        { type: 8, seasonId: 2020, staffName: "Natalie" },

        { type: 9, seasonId: 2019, staffName: "Michael" },
        { type: 9, seasonId: 2019, staffName: "Matthew" },
        { type: 9, seasonId: 2019, staffName: "Natalie" },*/

        
        { type: 8, seasonId: 24, staffName: "MAL", play: 7, win: 3, draw: 3, lose: 1, goalsFor: 9, goalsAgainst: 5, punctuality: 0, points: 12},
        { type: 8, seasonId: 24, staffName: "DAVIDT", play: 7, win: 2, draw: 4, lose: 1, goalsFor: 8, goalsAgainst: 6, punctuality: 1, points: 10 },
        { type: 8, seasonId: 24, staffName: "ANDY", play: 7, win: 2, draw: 3, lose: 2, goalsFor: 7, goalsAgainst: 7, punctuality: 4, points: 9 },
        { type: 8, seasonId: 24, staffName: "CHRIS", play: 7, win: 2, draw: 3, lose: 2, goalsFor: 7, goalsAgainst: 7, punctuality: 2, points: 9 },
        { type: 8, seasonId: 24, staffName: "PAUL", play: 7, win: 2, draw: 3, lose: 2, goalsFor: 7, goalsAgainst: 7, punctuality: 1, points: 9 },
        { type: 8, seasonId: 24, staffName: "DREW", play: 7, win: 2, draw: 2, lose: 3, goalsFor: 6, goalsAgainst: 6, punctuality: 3, points: 8 },
        { type: 8, seasonId: 24, staffName: "WILKA", play: 7, win: 1, draw: 4, lose: 2, goalsFor: 6, goalsAgainst: 6, punctuality: 2, points: 7 },
        { type: 8, seasonId: 24, staffName: "IANR", play: 7, win: 0, draw: 6, lose: 1, goalsFor: 6, goalsAgainst: 6, punctuality: 1, points: 6  },

        
        { type: 8, seasonId: 25, staffName: "ANDY", play: 2, win: 0, draw: 2, lose: 0, goalsFor: 6, goalsAgainst: 6, punctuality: 3, points: 8 },
        { type: 8, seasonId: 25, staffName: "MAL", play: 2, win: 2, draw: 0, lose: 0, goalsFor: 6, goalsAgainst: 6, punctuality: 2, points: 7 },
        { type: 8, seasonId: 25, staffName: "CHRISP", play: 2, win: 0, draw: 0, lose: 2, goalsFor: 6, goalsAgainst: 6, punctuality: 1, points: 6  },
      ]);
    });
};
