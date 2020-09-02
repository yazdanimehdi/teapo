
exports.up = function(knex) {
    return knex.schema.createTable('tpo_listeningtimes', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.integer('number').unsigned().notNullable();
        table.integer('time').unsigned().notNullable();
        table.integer('test_id').unsigned().index().references('id').inTable('tpo_test')
    }).createTable('tpo_speakingtimes', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.integer('number').unsigned().notNullable();
        table.integer('preparation_time').unsigned().notNullable();
        table.integer('answering_time').unsigned().notNullable();
        table.integer('reading_time').unsigned().nullable();
        table.integer('test_id').unsigned().index().references('id').inTable('tpo_test')
    }).createTable('tpo_writingtimes', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.integer('number').unsigned().notNullable();
        table.integer('time').unsigned().notNullable();
        table.integer('reading_time').unsigned().nullable();
        table.integer('test_id').unsigned().index().references('id').inTable('tpo_test')
    }).then(() => {})


};

exports.down = function(knex) {
    return knex.schema.dropTable('tpo_listeningtimes')
        .dropTable('tpo_speakingtimes')
        .dropTable('tpo_writingtimes').then(() => {})
};
