
exports.up = function(knex) {
    return knex.schema.createTable("kitty", table => {
        table.increments();
        table.string("date").notNullable();
        table.integer("type").notNullable();
        table.integer("seasonId").notNullable();
        table.string("staffName").notNullable();
        table.string("description").notNullable();
        table.float("value", 2).notNullable();
        table.float("total", 2).notNullable();
    
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("kitty");
};
