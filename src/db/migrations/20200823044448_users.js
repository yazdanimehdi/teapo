
exports.up = function(knex) {
    return knex.schema
        .createTable('institutions_users', function(table) {
            table.integer('id').unsigned().primary().notNullable();
            table.string('first_name', 225).notNullable();
            table.string('last_name', 225).notNullable();
            table.string('phone', 11).notNullable();
            table.string('email', 225).notNullable();
            table.integer('toefl_time').nullable();
        }).then(() => {})

};

exports.down = function(knex) {
    return knex.schema.dropTable('institutions_users').then(() => {})
};
