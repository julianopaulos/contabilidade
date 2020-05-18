module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
          filename: './src/database/db.sqlite'
        },
        migrations:{
          directory:'./src/database/migrations'
        },
        useNullAsDefault: true
    },
    
  production: {
    client: 'postgresql',
    connection: {
      database: 'contabilidade',
      user:     'julianop099',
      password: '1234567890'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}