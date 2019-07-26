
exports.up = function(knex) {
  return knex.schema.createTable("hall_of_fame", table => {
    table.integer("type").notNullable();
    table.string("staffName").notNullable();
    table.integer("wins").defaultTo(0);
    table.integer("draws").defaultTo(0);
    table.integer("plays").defaultTo(0);
    table.integer("percentage").defaultTo(0);
    table.integer("punctuality").defaultTo(0);
    table.integer("punctRate").defaultTo(0);
    table.integer("goalsAgainstTop").defaultTo(0);
    table.integer("highestGF").defaultTo(0);
    table.integer("drawRate").defaultTo(0);
    table.integer("scrappy").defaultTo(0);
    table.integer("scrappyRate").defaultTo(0);
    table.integer("streak").defaultTo(0);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
     return knex.schema.dropTable("hall_of_fame");
};
