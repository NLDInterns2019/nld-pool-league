
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('eight_ball_fixtures').del()
    .then(function () {
      // Inserts seed entries
      return knex('eight_ball_fixtures').insert([
        {seasonId: '2019', player1: 'Michael', player2: 'Matthew', /*dueDate: new Date('July 15, 2019').toISOString()*/},
        {seasonId: '2019', player1: 'Michael', player2: 'Natalie', /*dueDate: new Date('July 15, 2019').toISOString()*/},
        {seasonId: '2019', player1: 'Matthew', player2: 'Natalie', /*dueDate: new Date('July 15, 2019').toISOString()*/},
      ]);
    });
};
