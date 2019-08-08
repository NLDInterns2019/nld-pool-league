
exports.up = function(knex) {
    return knex.schema.table("eight_nine_ball_leagues", table => {
        table.string("form").defaultTo("-----")
    })
};

exports.down = function(knex) {
    return knex.schema.table("eight_nine_ball_leagues", table => {
        table.dropColumn("form")
    })
};
