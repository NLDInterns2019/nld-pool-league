
exports.up = function(knex) {
    return knex.schema.createTable("bookings", table => {
        table.increments();
        table.integer("date");
        table.integer("booking");
    
        table
          .foreign(["type","seasonId", "player1"])
          .references(["type","seasonId", "staffName"])
          .inTable("bookings")
          .onDelete("CASCADE");
        table
          .foreign(["type","seasonId", "player2"])
          .references(["type","seasonId", "staffName"])
          .inTable("bookings")
          .onDelete("NO ACTION");
    
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("bookings");
  };
