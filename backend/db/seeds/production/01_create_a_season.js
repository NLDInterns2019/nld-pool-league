exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("eight_nine_ball_seasons")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex.raw("INSERT INTO eight_nine_ball_seasons VALUES (8,2019,0,'2019-07-23 12:08:04','2019-07-23 12:08:04')")
    });
};
