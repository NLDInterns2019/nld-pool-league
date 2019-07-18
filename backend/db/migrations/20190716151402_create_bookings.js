exports.up = function(knex) {
  return knex.schema.createTable("bookings", table => {
    table.increments();
    table.string("start").unique().notNullable();
    table.string("end").unique().notNullable();
    table.integer("booking");
    table.string("player1").notNullable();
    table.string("player2").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("bookings");
};
