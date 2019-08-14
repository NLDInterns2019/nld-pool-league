exports.up = function(knex) {
    return knex.schema.createTable("position_history", table => {
      table.increments();
      table.unique(["type","staffName","seasonId"]);
      table.integer("type").notNullable();
      table.string("staffName").notNullable();
      table.integer("seasonId").notNullable();
      table.integer("position");

      table
      .foreign(["type","staffName", "seasonId"])
      .references(["type","staffName", "seasonId"])
      .inTable("eight_nine_ball_leagues")
      .onDelete("CASCADE");
  
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
       return knex.schema.dropTable("position_history");
  };
  