var moment = require("moment")

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("bookings")
    .del()
    .then(function() {
      return knex("bookings").insert([
        {
          start: moment()
            .toDate()
            .toISOString(),
          end: moment()
            .add(30, "minutes")
            .toDate()
            .toISOString(),
          player1: "Michael",
          player2: "Matthew",
          title: "Michael VS Matthew"
        },

        {
          start: moment()
            .add(1, "days")
            .toDate()
            .toISOString(),
          end: moment()
            .add(2, "days")
            .toDate()
            .toISOString(),
          player1: "Natalie",
          player2: "Matthew",
          title: "Natalie VS Matthew"
        },
        {
          start: moment()
            .add(2, "days")
            .toDate()
            .toISOString(),
          end: moment()
            .add(3, "days")
            .toDate()
            .toISOString(),
          player1: "Natalie",
          player2: "Michael",
          title: "Natalie VS Michael"
        }
      ]);
    });
};
