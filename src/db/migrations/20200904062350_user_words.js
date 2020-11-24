exports.up = function (knex) {
    return knex.schema.createTable('tpousers_studywords', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.text('definition').notNullable();
        table.integer('correct_times').unsigned().notNullable();
        table.integer('uncorrect_times').unsigned().notNullable();
        table.text('word').notNullable();
        table.text('label').notNullable();
        table.integer('state').unsigned().notNullable();
        table.dateTime('last_date').nullable();
        table.dateTime('last_time').notNullable();
        table.integer('user_id').unsigned().index().references('id').inTable('institutions_users').nullable();
    }).createTable('tpousers_studywordsexample', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.text('example').notNullable();
        table.integer('tpo_sudywords_id').unsigned().index().references('id').inTable('tpousers_studywords').nullable();
    })
}
exports.down = function (knex) {
    return knex.schema.dropTable('tpousers_studywords')
        .dropTable('tpousers_studywordsexamples')
}
