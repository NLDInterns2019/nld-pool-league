
exports.up = function(knex) {
    return knex.schema.createTable("kitty", table => {
        table.increments();
        table.string("seasonId").unique().notNullable();
        table.string("staffName").unique().notNullable();
        table.string("description").notNullable();
        table.integer("value").notNullable();
        table.integer("total").notNullable();
    
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("kitty");
};
