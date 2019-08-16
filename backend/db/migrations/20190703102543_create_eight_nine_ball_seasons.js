exports.up = function(knex) {
  return knex.schema.createTable("eight_nine_ball_seasons", table => {
    table.primary(["type","seasonId"]);
    table.integer("type").notNullable()
    table.integer("seasonId").notNullable();
    table.boolean("finished").notNullable().defaultTo(false);
    table.boolean("playoff").notNullable().defaultTo(false);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("eight_nine_ball_seasons");
};
