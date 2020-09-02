
exports.up = function(knex) {
    return knex.schema.createTable('tpo_listening', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.text('title').notNullable()
        table.text('listening').notNullable();
        table.text('listening_image').notNullable();
        table.string('type', 30).notNullable();
        table.text('transcript').nullable();

    }).createTable('tpo_listeningquestions', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.text('question').notNullable();
        table.text('listening_question_audio_file').notNullable();
        table.integer('number').unsigned().notNullable();
        table.boolean('quote').notNullable();
        table.text('quote_audio_file').nullable();
        table.string('right_answer', 50).notNullable();
        table.integer('listening_id').unsigned().index().references('id').inTable('tpo_listening');

    }).createTable('tpo_listeninganswers', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.text('answer').notNullable();
        table.string('code', 1).notNullable();
        table.integer('question_id').unsigned().index().references('id').inTable('tpo_listeningquestions');

    }).createTable('tpo_reading', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.text('title').notNullable();
        table.text('passage').notNullable();

    }).createTable('tpo_readingquestions', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.text('question').notNullable();
        table.text('insertion_sentence').nullable();
        table.integer('number').unsigned().notNullable();
        table.integer('related_paragraph').unsigned().nullable();
        table.text('related_passage').nullable();
        table.text('related_passage_title').nullable();
        table.string('question_type', 10).notNullable();
        table.string('right_answer', 50).notNullable();
        table.integer('reading_id').unsigned().index().references('id').inTable('tpo_reading')

    }).createTable('tpo_readinganswers', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.text('answer').notNullable();
        table.string('code', 1).notNullable();
        table.integer('question_id').unsigned().index().references('id').inTable('tpo_readingquestions')

    }).createTable('tpo_speaking', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.text('speaking_audio_file').nullable();
        table.text('speaking_reading_title').nullable();
        table.text('speaking_reading').nullable();
        table.text('speaking_image').nullable();
        table.text('speaking_question').notNullable();
        table.text('speaking_question_audio_file').nullable();
        table.text('speaking_question_guide_audio_file').nullable();
        table.text('speaking_question_before_read_audio').nullable();
        table.integer('number').unsigned().notNullable();
        table.text('speaking_audio_file_transcript').nullable();
        table.integer('sections').unsigned().notNullable();

    }).createTable('tpo_writing', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.text('writing_listening').nullable();
        table.text('writing_image').nullable();
        table.text('writing_reading').nullable();
        table.text('writing_question').notNullable();
        table.string('type', 30).notNullable();
        table.text('writing_listening_transcript').nullable();
        table.integer('sections').unsigned().notNullable();

    }).then(() => {})
  
};

exports.down = function(knex) {
  return knex.schema
      .dropTable('tpo_listeninganswers')
      .dropTable('tpo_listeningquestions')
      .dropTable('tpo_listening')
      .dropTable('tpo_readinganswers')
      .dropTable('tpo_readingquestions')
      .dropTable('tpo_reading')
      .dropTable('tpo_speaking')
      .dropTable('tpo_writing').then(() => {})
};
