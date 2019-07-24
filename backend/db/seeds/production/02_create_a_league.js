exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("eight_nine_ball_leagues")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex.raw(
        "INSERT INTO eight_nine_ball_leagues VALUES (2019,'PAUL',8,12,7,5,0,19,5,12,26,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'CHRIS',8,12,8,2,2,18,6,12,26,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'ANDY',8,12,6,6,0,18,6,12,24,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'SIMON',8,12,6,4,2,16,8,12,22,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'MAL',8,12,5,6,1,16,8,12,21,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'IANH',8,12,4,7,1,15,9,12,19,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'IANM',8,12,4,5,3,13,11,12,17,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'DAVIDT',8,12,4,3,5,11,13,12,15,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'IANR',8,12,3,5,4,11,13,12,14,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'DREW',8,12,1,6,5,8,16,12,9,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'ELIOT',8,12,1,4,7,6,18,12,7,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'DAVIDW',8,12,0,3,9,3,21,12,3,'2019-07-23 12:08:04','2019-07-23 12:08:04');"
      + "INSERT INTO eight_nine_ball_leagues VALUES (2019,'JACOB',8,12,0,2,10,2,22,12,2,'2019-07-23 12:08:04','2019-07-23 12:08:04');")
    });
};
