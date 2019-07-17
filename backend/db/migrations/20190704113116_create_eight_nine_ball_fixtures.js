exports.up = function(knex) {
  return knex.schema.createTable("eight_nine_ball_fixtures", table => {
    table.increments();
    table.unique(["type","seasonId", "player1", "player2"]);
    table.integer("type").notNullable();
    table.integer("seasonId").notNullable();
    table.string("player1").notNullable();
    table.integer("score1");
    table.string("player2").notNullable();
    table.integer("score2");
    table.integer("group");
    table.string("date");
    table.integer("booked");

    table
      .foreign(["type","seasonId", "player1"])
      .references(["type","seasonId", "staffName"])
      .inTable("eight_nine_ball_leagues")
      .onDelete("CASCADE");
    table
      .foreign(["type","seasonId", "player2"])
      .references(["type","seasonId", "staffName"])
      .inTable("eight_nine_ball_leagues")
      .onDelete("NO ACTION");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("eight_nine_ball_fixtures");
};
