
exports.up = function(knex) {
  return knex.schema.createTable('tpousers_testuser', function (table) {
      table.increments('id').unsigned().primary().notNullable();
      table.boolean('is_paid').notNullable();
      table.boolean('is_done').defaultTo(false).notNullable();
      table.dateTime('date_time').notNullable();
      table.integer('listening_score').nullable();
      table.integer('reading_score').nullable();
      table.integer('speaking_score').nullable();
      table.integer('writing_score').nullable();
      table.integer('remaining_time').nullable();
      table.integer('section_number').nullable();
      table.integer('task_number').nullable();
      table.integer('question_number').nullable();
      table.integer('exam_section').nullable();
      table.string('array_slot_1', 20).nullable();
      table.string('array_slot_2', 20).nullable();
      table.string('array_slot_3', 20).nullable();
      table.string('array_slot_4', 20).nullable();
      table.string('mode', 20).nullable();
      table.integer('test_id').unsigned().index().references('id').inTable('tpo_test').nullable();
      table.integer('user_id').unsigned().index().references('id').inTable('institutions_users').nullable();

  }).createTable('tpousers_userlisteninganswers', function (table) {
      table.increments('id').unsigned().primary().notNullable();
      table.string('answer', 50).nullable();
      table.integer('question_id').unsigned().index().references('id').inTable('tpo_listeningquestions').nullable();
      table.integer('user_test_id').unsigned().index().references('id').inTable('tpousers_testuser').nullable();

  }).createTable('tpousers_userreadinganswers', function (table) {
      table.increments('id').unsigned().primary().notNullable();
      table.string('answer', 50).nullable();
      table.integer('question_id').unsigned().index().references('id').inTable('tpo_readingquestions').nullable();
      table.integer('user_test_id').unsigned().index().references('id').inTable('tpousers_testuser').nullable();

  }).createTable('tpousers_userspeakinganswers', function (table) {
      table.increments('id').unsigned().primary().notNullable();
      table.text('answer').nullable();
      table.integer('question_id').unsigned().index().references('id').inTable('tpo_speaking').nullable();
      table.integer('user_test_id').unsigned().index().references('id').inTable('tpousers_testuser').nullable();

  }).createTable('tpousers_userwritinganswers', function (table) {
      table.increments('id').unsigned().primary().notNullable();
      table.text('answer').nullable();
      table.integer('question_id').unsigned().index().references('id').inTable('tpo_writing').nullable();
      table.integer('user_test_id').unsigned().index().references('id').inTable('tpousers_testuser').nullable();

  }).then(() => {})
};

exports.down = function(knex) {
  return knex.schema.dropTable('tpousers_userwritinganswers')
      .dropTable('tpousers_userspeakinganswers')
      .dropTable('tpousers_userreadinganswers')
      .dropTable('tpousers_userlisteninganswers')
      .dropTable('tpousers_testuser').then(() => {})
};
