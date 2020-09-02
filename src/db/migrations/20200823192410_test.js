
exports.up = function(knex) {
    return knex.schema.createTable('tpo_test', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.string('title', 225).notNullable();
        table.string('code', 225).notNullable();
        table.string('mode', 1).notNullable();
        table.dateTime('start_time').nullable();
        table.dateTime('end_time').nullable();
        table.dateTime('deadline').nullable();
        table.integer('reading_time').nullable();
        table.integer('class_assigned_id').unsigned().index().references('id').inTable('institutions_class').nullable();
        table.integer('institute_id').unsigned().index().references('id').inTable('institutions_users').nullable();

    }).createTable('tpo_testlistening', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.integer('part').unsigned().notNullable();
        table.integer('phase').unsigned().notNullable();
        table.integer('listening_id').unsigned().index().references('id').inTable('tpo_listening').nullable();
        table.integer('test_id').unsigned().index().references('id').inTable('tpo_test').nullable();

    }).createTable('tpo_testreading', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.integer('part').unsigned().notNullable();
        table.integer('reading_id').unsigned().index().references('id').inTable('tpo_reading').nullable();
        table.integer('test_id').unsigned().index().references('id').inTable('tpo_test').nullable();

    }).createTable('tpo_testspeaking', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.integer('part').unsigned().notNullable();
        table.integer('speaking_id').unsigned().index().references('id').inTable('tpo_speaking').nullable();
        table.integer('test_id').unsigned().index().references('id').inTable('tpo_test').nullable();

    }).createTable('tpo_testwriting', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.integer('part').unsigned().notNullable();
        table.integer('writing_id').unsigned().index().references('id').inTable('tpo_writing').nullable();
        table.integer('test_id').unsigned().index().references('id').inTable('tpo_test').nullable();
    }).then(() => {})
};

exports.down = function(knex) {
    return knex.schema.dropTable('tpo_testwriting')
        .dropTable('tpo_testspeaking')
        .dropTable('tpo_testreading')
        .dropTable('tpo_testlistening')
        .dropTable('tpo_test').then(() => {})
};
