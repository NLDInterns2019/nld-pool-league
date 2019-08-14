
exports.up = function(knex) {
    return knex.schema.table("bookings", table => {
        table.integer("type")
    })
};

exports.down = function(knex) {
    return knex.schema.table("bookings", table => {
        table.dropColumn("type")
    })
};
