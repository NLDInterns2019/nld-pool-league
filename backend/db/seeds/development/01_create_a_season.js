exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("eight_nine_ball_seasons")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("eight_nine_ball_seasons").insert([
        /*{ type: 8, seasonId: 2019},
        { type: 8, seasonId: 2020},
        { type: 9, seasonId: 2019},*/
        
        { type: 8, seasonId: 24},
        { type: 8, seasonId: 25},
        { type: 8, seasonId: 26},
        { type: 8, seasonId: 27},

      ]);
    });
};
