var moment = require("moment")
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('kitty').del()
    .then(function () {
      return knex("kitty").insert([
        {date: moment().toDate().toISOString(), type: 8, seasonId: 2020, staffName: 'Michael', description: "Joining fee", value: 2.0, total: 2.0},
        {date: moment().toDate().toISOString(), type: 8, seasonId: 2020, staffName: 'Matthew', description: "Joining fee", value: 2.0, total: 4.0},
        {date: moment().toDate().toISOString(), type: 8, seasonId: 2020, staffName: 'Natalie', description: "Joining fee", value: 2.0, total: 6.0}
      ]);

    });
};
