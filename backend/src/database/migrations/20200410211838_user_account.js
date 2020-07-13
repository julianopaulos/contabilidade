exports.up = function(knex) {
    return knex.schema.createTable('user_account',function(table){
        table.increments("id").primary();
        table.int('id_user').notNullable();
        table.double('total_income').notNullable();
        table.string('meta').notNullable();
        
        table.foreign('id_user').references('id').inTable('user');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_account');
};
