exports.up = function(knex) {
    return knex.schema.createTable('user_expenses',function(table){
        table.increments("id").primary();
        table.int('id_user_account').notNullable();
        table.double('value').notNullable();
        table.string('description').notNullable();
        table.date('date_expense').notNullable();
        
        table.foreign('id_user_account').references('id').inTable('user_account');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_expenses');
};
