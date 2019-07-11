exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("eight_nine_ball_leagues")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("eight_nine_ball_leagues").insert([
        { type: 8, seasonId: 2019, staffName: "Michael" },
        { type: 8, seasonId: 2019, staffName: "Matthew" },
        { type: 8, seasonId: 2019, staffName: "Natalie" },
        { type: 8, seasonId: 2020, staffName: "Michael" },
        { type: 8, seasonId: 2020, staffName: "Matthew" },
        { type: 8, seasonId: 2020, staffName: "Natalie" },

        { type: 9, seasonId: 2019, staffName: "Michael" },
        { type: 9, seasonId: 2019, staffName: "Matthew" },
        { type: 9, seasonId: 2019, staffName: "Natalie" },
      ]);
    });
};
