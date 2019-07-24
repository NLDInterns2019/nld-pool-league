BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "bookings" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"start"	datetime NOT NULL,
	"end"	datetime NOT NULL,
	"player1"	varchar(255) NOT NULL,
	"player2"	varchar(255) NOT NULL,
	"title"	varchar(255) NOT NULL,
	"created_at"	datetime DEFAULT CURRENT_TIMESTAMP,
	"updated_at"	datetime DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "eight_nine_ball_fixtures" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"type"	integer NOT NULL,
	"seasonId"	integer NOT NULL,
	"player1"	varchar(255) NOT NULL,
	"score1"	integer,
	"player2"	varchar(255) NOT NULL,
	"score2"	integer,
	"group"	integer,
	"date"	datetime,
	"booked"	datetime,
	"created_at"	datetime DEFAULT CURRENT_TIMESTAMP,
	"updated_at"	datetime DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("type","seasonId","player1") REFERENCES "eight_nine_ball_leagues"("type","seasonId","staffName") on delete CASCADE,
	FOREIGN KEY("type","seasonId","player2") REFERENCES "eight_nine_ball_leagues"("type","seasonId","staffName") on delete NO ACTION
);
CREATE TABLE IF NOT EXISTS "eight_nine_ball_leagues" (
	"seasonId"	integer NOT NULL,
	"staffName"	varchar(255) NOT NULL,
	"type"	integer NOT NULL,
	"play"	integer DEFAULT '0',
	"win"	integer DEFAULT '0',
	"draw"	integer DEFAULT '0',
	"lose"	integer DEFAULT '0',
	"goalsFor"	integer DEFAULT '0',
	"goalsAgainst"	integer DEFAULT '0',
	"punctuality"	integer DEFAULT '0',
	"points"	integer DEFAULT '0',
	"created_at"	datetime DEFAULT CURRENT_TIMESTAMP,
	"updated_at"	datetime DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY("type","seasonId") REFERENCES "eight_nine_ball_seasons"("type","seasonId") on delete CASCADE,
	PRIMARY KEY("type","seasonId","staffName")
);
CREATE TABLE IF NOT EXISTS "eight_nine_ball_seasons" (
	"type"	integer NOT NULL,
	"seasonId"	integer NOT NULL,
	"finished"	boolean NOT NULL DEFAULT '0',
	"created_at"	datetime DEFAULT CURRENT_TIMESTAMP,
	"updated_at"	datetime DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("type","seasonId")
);
CREATE TABLE IF NOT EXISTS "knex_migrations_lock" (
	"index"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"is_locked"	integer
);
CREATE TABLE IF NOT EXISTS "knex_migrations" (
	"id"	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name"	varchar(255),
	"batch"	integer,
	"migration_time"	datetime
);
INSERT INTO "eight_nine_ball_fixtures" VALUES (27,8,2019,'ANDY',1,'PAUL',1,0,'2019-07-30T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (28,8,2019,'CHRIS',1,'MAL',1,0,'2019-07-30T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (29,8,2019,'DAVIDT',2,'JACOB',0,0,'2019-07-30T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (30,8,2019,'DAVIDW',0,'IANR',2,0,'2019-07-30T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (31,8,2019,'DREW',1,'IANM',1,0,'2019-07-30T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (32,8,2019,'ELIOT',1,'IANH',1,0,'2019-07-30T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (33,8,2019,'CHRIS',0,'SIMON',2,1,'2019-08-06T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (34,8,2019,'DAVIDT',0,'PAUL',2,1,'2019-08-06T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (35,8,2019,'DAVIDW',0,'MAL',2,1,'2019-08-06T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (36,8,2019,'DREW',2,'JACOB',0,1,'2019-08-06T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (37,8,2019,'ELIOT',0,'IANR',2,1,'2019-08-06T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (38,8,2019,'IANH',1,'IANM',1,1,'2019-08-06T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (39,8,2019,'DAVIDT',0,'ANDY',2,2,'2019-08-13T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (40,8,2019,'DAVIDW',0,'SIMON',2,2,'2019-08-13T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (41,8,2019,'DREW',0,'PAUL',2,2,'2019-08-13T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (42,8,2019,'ELIOT',0,'MAL',2,2,'2019-08-13T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (43,8,2019,'IANH',2,'JACOB',0,2,'2019-08-13T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (44,8,2019,'IANM',1,'IANR',1,2,'2019-08-13T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (45,8,2019,'DAVIDW',0,'CHRIS',2,3,'2019-08-20T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (46,8,2019,'DREW',0,'ANDY',2,3,'2019-08-20T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (47,8,2019,'ELIOT',0,'SIMON',2,3,'2019-08-20T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (48,8,2019,'IANH',1,'PAUL',1,3,'2019-08-20T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (49,8,2019,'IANM',1,'MAL',1,3,'2019-08-20T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (50,8,2019,'IANR',1,'JACOB',1,3,'2019-08-20T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (51,8,2019,'DREW',1,'DAVIDT',1,4,'2019-08-27T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (52,8,2019,'ELIOT',0,'CHRIS',2,4,'2019-08-27T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (53,8,2019,'IANH',1,'ANDY',1,4,'2019-08-27T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (54,8,2019,'IANM',0,'SIMON',2,4,'2019-08-27T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (55,8,2019,'IANR',1,'PAUL',1,4,'2019-08-27T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (56,8,2019,'JACOB',0,'MAL',2,4,'2019-08-27T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (57,8,2019,'ELIOT',1,'DAVIDW',1,5,'2019-09-03T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (58,8,2019,'IANH',2,'DAVIDT',0,5,'2019-09-03T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (59,8,2019,'IANM',0,'CHRIS',2,5,'2019-09-03T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (60,8,2019,'IANR',0,'ANDY',2,5,'2019-09-03T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (61,8,2019,'JACOB',0,'SIMON',2,5,'2019-09-03T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (62,8,2019,'MAL',1,'PAUL',1,5,'2019-09-03T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (63,8,2019,'IANH',2,'DREW',0,6,'2019-09-10T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (64,8,2019,'IANM',2,'DAVIDW',0,6,'2019-09-10T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (65,8,2019,'IANR',0,'DAVIDT',2,6,'2019-09-10T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (66,8,2019,'JACOB',0,'CHRIS',2,6,'2019-09-10T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (67,8,2019,'MAL',1,'ANDY',1,6,'2019-09-10T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (68,8,2019,'PAUL',1,'SIMON',1,6,'2019-09-10T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (69,8,2019,'IANM',2,'ELIOT',0,7,'2019-09-17T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (70,8,2019,'IANR',1,'DREW',1,7,'2019-09-17T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (71,8,2019,'JACOB',1,'DAVIDW',1,7,'2019-09-17T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (72,8,2019,'MAL',1,'DAVIDT',1,7,'2019-09-17T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (73,8,2019,'PAUL',2,'CHRIS',0,7,'2019-09-17T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (74,8,2019,'SIMON',0,'ANDY',2,7,'2019-09-17T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (75,8,2019,'IANR',1,'IANH',1,8,'2019-09-24T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (76,8,2019,'JACOB',0,'ELIOT',2,8,'2019-09-24T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (77,8,2019,'MAL',2,'DREW',0,8,'2019-09-24T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (78,8,2019,'PAUL',2,'DAVIDW',0,8,'2019-09-24T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (79,8,2019,'SIMON',1,'DAVIDT',1,8,'2019-09-24T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (80,8,2019,'ANDY',1,'CHRIS',1,8,'2019-09-24T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (81,8,2019,'JACOB',0,'IANM',2,9,'2019-10-01T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (82,8,2019,'MAL',1,'IANH',1,9,'2019-10-01T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (83,8,2019,'PAUL',2,'ELIOT',0,9,'2019-10-01T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (84,8,2019,'SIMON',1,'DREW',1,9,'2019-10-01T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (85,8,2019,'ANDY',2,'DAVIDW',0,9,'2019-10-01T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (86,8,2019,'CHRIS',2,'DAVIDT',0,9,'2019-10-01T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (87,8,2019,'MAL',2,'IANR',0,10,'2019-10-08T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (88,8,2019,'PAUL',2,'IANM',0,10,'2019-10-08T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (89,8,2019,'SIMON',1,'IANH',1,10,'2019-10-08T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (90,8,2019,'ANDY',1,'ELIOT',1,10,'2019-10-08T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (91,8,2019,'CHRIS',2,'DREW',0,10,'2019-10-08T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (92,8,2019,'DAVIDT',2,'DAVIDW',0,10,'2019-10-08T12:08:05.093Z',NULL,'2019-07-23 12:08:05','2019-07-23 12:08:05');
INSERT INTO "eight_nine_ball_fixtures" VALUES (93,8,2019,'PAUL',2,'JACOB',0,11,'2019-10-15T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (94,8,2019,'SIMON',0,'IANR',2,11,'2019-10-15T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (95,8,2019,'ANDY',1,'IANM',1,11,'2019-10-15T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (96,8,2019,'CHRIS',2,'IANH',0,11,'2019-10-15T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (97,8,2019,'DAVIDT',2,'ELIOT',0,11,'2019-10-15T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (98,8,2019,'DAVIDW',1,'DREW',1,11,'2019-10-15T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (99,8,2019,'SIMON',2,'MAL',0,12,'2019-10-22T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (100,8,2019,'ANDY',2,'JACOB',0,12,'2019-10-22T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (101,8,2019,'CHRIS',2,'IANR',0,12,'2019-10-22T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (102,8,2019,'DAVIDT',0,'IANM',2,12,'2019-10-22T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (103,8,2019,'DAVIDW',0,'IANH',2,12,'2019-10-22T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_fixtures" VALUES (104,8,2019,'DREW',1,'ELIOT',1,12,'2019-10-22T12:08:05.093Z',NULL,'2019-07-23 12:08:06','2019-07-23 12:08:06');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'PAUL',8,12,7,5,0,19,5,12,26,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'CHRIS',8,12,8,2,2,18,6,12,26,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'ANDY',8,12,6,6,0,18,6,12,24,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'SIMON',8,12,6,4,2,16,8,12,22,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'MAL',8,12,5,6,1,16,8,12,21,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'IANH',8,12,4,7,1,15,9,12,19,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'IANM',8,12,4,5,3,13,11,12,17,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'DAVIDT',8,12,4,3,5,11,13,12,15,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'IANR',8,12,3,5,4,11,13,12,14,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'DREW',8,12,1,6,5,8,16,12,9,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'ELIOT',8,12,1,4,7,6,18,12,7,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'DAVIDW',8,12,0,3,9,3,21,12,3,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_leagues" VALUES (2019,'JACOB',8,12,0,2,10,2,22,12,2,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "eight_nine_ball_seasons" VALUES (8,2019,0,'2019-07-23 12:08:04','2019-07-23 12:08:04');
INSERT INTO "knex_migrations_lock" VALUES (1,0);
INSERT INTO "knex_migrations" VALUES (2612,'20190703102543_create_eight_nine_ball_seasons.js',1,1563879243066);
INSERT INTO "knex_migrations" VALUES (2613,'20190704102543_create_eight_nine_ball_leagues.js',1,1563879243067);
INSERT INTO "knex_migrations" VALUES (2614,'20190704113116_create_eight_nine_ball_fixtures.js',1,1563879243068);
INSERT INTO "knex_migrations" VALUES (2615,'20190716151402_create_bookings.js',1,1563879243070);
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_end_unique" ON "bookings" (
	"end"
);
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_start_unique" ON "bookings" (
	"start"
);
CREATE UNIQUE INDEX IF NOT EXISTS "eight_nine_ball_fixtures_type_seasonid_player1_player2_unique" ON "eight_nine_ball_fixtures" (
	"type",
	"seasonId",
	"player1",
	"player2"
);
COMMIT;