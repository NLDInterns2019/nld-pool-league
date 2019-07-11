
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('eight_nine_ball_fixtures').del()
    .then(function () {
    });
};
