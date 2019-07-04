exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("eight_ball_leagues")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("eight_ball_leagues").insert([
        { seasonId: "2019", staffName: "Michael" },
        { seasonId: "2019", staffName: "Matthew" },
        { seasonId: "2019", staffName: "Natalie" }
      ]);
    });
};
