
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('eight_nine_ball_fixtures').del()
    .then(function () {
      // Inserts seed entries
      return knex('eight_nine_ball_fixtures').insert([
        {type: 8, seasonId: 2019, player1: 'Michael', player2: 'Matthew'},
        {type: 8, seasonId: 2019, player1: 'Michael', player2: 'Natalie'},
        {type: 8, seasonId: 2019, player1: 'Matthew', player2: 'Natalie'},

        {type: 8, seasonId: 2020, player1: 'Michael', player2: 'Matthew'},
        {type: 8, seasonId: 2020, player1: 'Michael', player2: 'Natalie'},
        {type: 8, seasonId: 2020, player1: 'Matthew', player2: 'Natalie',},

        {type: 9, seasonId: 2019, player1: 'Michael', player2: 'Matthew'},
        {type: 9, seasonId: 2019, player1: 'Michael', player2: 'Natalie'},
        {type: 9, seasonId: 2019, player1: 'Matthew', player2: 'Natalie'},
      ]);
    });
};
