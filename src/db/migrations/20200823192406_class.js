
exports.up = function(knex) {
    return knex.schema.createTable('institutions_classcategory', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.text('name').notNullable();
        table.integer('institute_id').unsigned().index().references('id').inTable('institutions_users').notNullable();

    }).createTable('institutions_class', function (table) {
        table.integer('id').unsigned().primary().notNullable();
        table.text('name').notNullable();
        table.integer('category_id').unsigned().index().references('id').inTable('institutions_classcategory').nullable();
        table.integer('teacher_id').unsigned().index().references('id').inTable('institutions_users').nullable();

    }).createTable('institutions_classfiles', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.dateTime('date_added').notNullable();
        table.text('file').notNullable();
        table.integer('related_class_id').unsigned().index().references('id').inTable('institutions_class').nullable();

    }).createTable('institutions_class_students', function (table) {
        table.increments('id').unsigned().primary().notNullable();
        table.integer('class_id').unsigned().index().references('id').inTable('institutions_class').nullable();
        table.integer('users_id').unsigned().index().references('id').inTable('institutions_users').nullable();
    }).then(() => {})
};

exports.down = function(knex) {
  return knex.schema.dropTable('institutions_class_students')
      .dropTable('institutions_classfiles')
      .dropTable('institutions_class')
      .dropTable('institutions_classcategory').then(() => {})
};
