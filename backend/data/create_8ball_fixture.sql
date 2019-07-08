DROP TABLE IF EXISTS `eight_ball_fixtures`;

CREATE TABLE IF NOT EXISTS `eight_ball_fixtures` 
(`id` INTEGER PRIMARY KEY AUTOINCREMENT,
 `seasonId` INTEGER NOT NULL, 
 `score1` INTEGER,
 `player1` VARCHAR(255) NOT NULL,
 `player2` VARCHAR(255) NOT NULL,
 `score2` INTEGER,
 `createdAt` DATETIME NOT NULL,
 `updatedAt` DATETIME NOT NULL,
 CONSTRAINT `eight_ball_fixtures` FOREIGN KEY (seasonId, player1) REFERENCES `eight_ball_leagues` (seasonId, staffName),
 CONSTRAINT `eight_ball_fixtures` FOREIGN KEY (seasonId, player2) REFERENCES `eight_ball_leagues` (seasonId, staffName));
 
 CREATE UNIQUE INDEX `eight_ball_fixtures_season_id_player1_player2` ON `eight_ball_fixtures` (`seasonId`, `player1`, `player2`);