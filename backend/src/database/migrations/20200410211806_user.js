
exports.up = function(knex) {
    return knex.schema.createTable('user',function(table){
        table.int('id').primary().notNullable().unique();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('phone').notNullable();
        table.string('pass').notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('user');
};
