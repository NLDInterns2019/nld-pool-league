exports.up = function(knex) {
  return knex.schema.createTable("eight_ball_fixtures", table => {
    table.increments();
    table.unique(["seasonId", "player1", "player2"]);
    table.integer("seasonId").notNullable();
    table.string("player1").notNullable();
    table.integer("score1");
    table.string("player2").notNullable();
    table.integer("score2");
    // table.date("dueDate").notNullable();

    table
      .foreign(["seasonId", "player1"])
      .references(["seasonId", "staffName"])
      .inTable("eight_ball_leagues")
      .onDelete("CASCADE");
    table
      .foreign(["seasonId", "player2"])
      .references(["seasonId", "staffName"])
      .inTable("eight_ball_leagues")
      .onDelete("CASCADE");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("eight_ball_fixtures");
};
