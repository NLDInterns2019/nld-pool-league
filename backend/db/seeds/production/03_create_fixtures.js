exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("eight_nine_ball_fixtures")
    .del()
    .then(function() {
      return knex.raw(
        "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ANDY',1,'PAUL',1,0,'2019-07-30T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'CHRIS',1,'MAL',1,0,'2019-07-30T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDT',2,'JACOB',0,0,'2019-07-30T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDW',0,'IANR',2,0,'2019-07-30T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DREW',1,'IANM',1,0,'2019-07-30T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ELIOT',1,'IANH',1,0,'2019-07-30T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'CHRIS',0,'SIMON',2,1,'2019-08-06T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDT',0,'PAUL',2,1,'2019-08-06T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDW',0,'MAL',2,1,'2019-08-06T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DREW',2,'JACOB',0,1,'2019-08-06T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ELIOT',0,'IANR',2,1,'2019-08-06T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANH',1,'IANM',1,1,'2019-08-06T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDT',0,'ANDY',2,2,'2019-08-13T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDW',0,'SIMON',2,2,'2019-08-13T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DREW',0,'PAUL',2,2,'2019-08-13T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ELIOT',0,'MAL',2,2,'2019-08-13T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANH',2,'JACOB',0,2,'2019-08-13T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANM',1,'IANR',1,2,'2019-08-13T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDW',0,'CHRIS',2,3,'2019-08-20T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DREW',0,'ANDY',2,3,'2019-08-20T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ELIOT',0,'SIMON',2,3,'2019-08-20T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANH',1,'PAUL',1,3,'2019-08-20T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANM',1,'MAL',1,3,'2019-08-20T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANR',1,'JACOB',1,3,'2019-08-20T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DREW',1,'DAVIDT',1,4,'2019-08-27T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ELIOT',0,'CHRIS',2,4,'2019-08-27T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANH',1,'ANDY',1,4,'2019-08-27T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANM',0,'SIMON',2,4,'2019-08-27T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANR',1,'PAUL',1,4,'2019-08-27T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'JACOB',0,'MAL',2,4,'2019-08-27T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ELIOT',1,'DAVIDW',1,5,'2019-09-03T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANH',2,'DAVIDT',0,5,'2019-09-03T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANM',0,'CHRIS',2,5,'2019-09-03T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANR',0,'ANDY',2,5,'2019-09-03T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'JACOB',0,'SIMON',2,5,'2019-09-03T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'MAL',1,'PAUL',1,5,'2019-09-03T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANH',2,'DREW',0,6,'2019-09-10T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANM',2,'DAVIDW',0,6,'2019-09-10T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANR',0,'DAVIDT',2,6,'2019-09-10T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'JACOB',0,'CHRIS',2,6,'2019-09-10T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'MAL',1,'ANDY',1,6,'2019-09-10T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'PAUL',1,'SIMON',1,6,'2019-09-10T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANM',2,'ELIOT',0,7,'2019-09-17T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANR',1,'DREW',1,7,'2019-09-17T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'JACOB',1,'DAVIDW',1,7,'2019-09-17T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'MAL',1,'DAVIDT',1,7,'2019-09-17T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'PAUL',2,'CHRIS',0,7,'2019-09-17T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'SIMON',0,'ANDY',2,7,'2019-09-17T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'IANR',1,'IANH',1,8,'2019-09-24T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'JACOB',0,'ELIOT',2,8,'2019-09-24T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'MAL',2,'DREW',0,8,'2019-09-24T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'PAUL',2,'DAVIDW',0,8,'2019-09-24T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'SIMON',1,'DAVIDT',1,8,'2019-09-24T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ANDY',1,'CHRIS',1,8,'2019-09-24T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'JACOB',0,'IANM',2,9,'2019-10-01T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'MAL',1,'IANH',1,9,'2019-10-01T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'PAUL',2,'ELIOT',0,9,'2019-10-01T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'SIMON',1,'DREW',1,9,'2019-10-01T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ANDY',2,'DAVIDW',0,9,'2019-10-01T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'CHRIS',2,'DAVIDT',0,9,'2019-10-01T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'MAL',2,'IANR',0,10,'2019-10-08T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'PAUL',2,'IANM',0,10,'2019-10-08T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'SIMON',1,'IANH',1,10,'2019-10-08T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ANDY',1,'ELIOT',1,10,'2019-10-08T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'CHRIS',2,'DREW',0,10,'2019-10-08T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDT',2,'DAVIDW',0,10,'2019-10-08T12:08:05.093Z','2019-07-23 12:08:05','2019-07-23 12:08:05');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'PAUL',2,'JACOB',0,11,'2019-10-15T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'SIMON',0,'IANR',2,11,'2019-10-15T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ANDY',1,'IANM',1,11,'2019-10-15T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'CHRIS',2,'IANH',0,11,'2019-10-15T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDT',2,'ELIOT',0,11,'2019-10-15T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDW',1,'DREW',1,11,'2019-10-15T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'SIMON',2,'MAL',0,12,'2019-10-22T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'ANDY',2,'JACOB',0,12,'2019-10-22T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'CHRIS',2,'IANR',0,12,'2019-10-22T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDT',0,'IANM',2,12,'2019-10-22T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DAVIDW',0,'IANH',2,12,'2019-10-22T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');" +
          "INSERT INTO eight_nine_ball_fixtures VALUES (8,2019,'DREW',1,'ELIOT',1,12,'2019-10-22T12:08:05.093Z','2019-07-23 12:08:06','2019-07-23 12:08:06');"
      );
    });
};
