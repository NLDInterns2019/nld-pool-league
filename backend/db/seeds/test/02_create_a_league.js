exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("eight_nine_ball_leagues")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("eight_nine_ball_leagues").insert([
        { type: 8, seasonId: 2019, staffName: "Michael" ,form:"-----"},
        { type: 8, seasonId: 2019, staffName: "Matthew" ,form:"-----"},
        { type: 8, seasonId: 2019, staffName: "Natalie" ,form:"-----"},
        { type: 8, seasonId: 2020, staffName: "Michael" ,form:"-----"},
        { type: 8, seasonId: 2020, staffName: "Matthew" ,form:"-----"},
        { type: 8, seasonId: 2020, staffName: "Natalie" ,form:"-----"},
        { type: 8, seasonId: 2021, staffName: "Michael" ,form:"-----"},
        { type: 8, seasonId: 2021, staffName: "Matthew" ,form:"-----"},
        { type: 8, seasonId: 2021, staffName: "Natalie" ,form:"-----"},


        { type: 9, seasonId: 2019, staffName: "Michael" ,form:"-----"},
        { type: 9, seasonId: 2019, staffName: "Matthew" ,form:"-----"},
        { type: 9, seasonId: 2019, staffName: "Natalie" ,form:"-----"},
        { type: 9, seasonId: 2020, staffName: "Michael" ,form:"-----"},
        { type: 9, seasonId: 2020, staffName: "Matthew" ,form:"-----"},
        { type: 9, seasonId: 2020, staffName: "Natalie" ,form:"-----"},
      ]);
    });
};
