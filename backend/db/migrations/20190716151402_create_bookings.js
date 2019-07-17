
exports.up = function(knex) {
    return knex.schema.createTable("bookings", table => {
        table.increments();
        table.string("date");
        table.integer("booking");
    
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("bookings");
  };
