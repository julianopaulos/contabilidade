exports.up = function(knex) {
    return knex.schema.createTable('user_img',function(table){
        table.increments("id").primary();
        table.int('id_user').notNullable();
        table.string('name').notNullable();
        table.string('size').notNullable();
        table.string('url').notNullable();
        
        table.foreign('id_user').references('id').inTable('user');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_img');
};
