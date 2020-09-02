// Update with your config settings.


const electron = require("electron");
const app = (electron.app || electron.remote.app);

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: `${app.getPath('userData')}/database.sqlite`
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/db/migrations'
    },
    useNullAsDefault: true
  },


  production: {
    client: 'sqlite3',
    connection: {
      filename: `${app.getPath('userData')}/database.sqlite`
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/db/migrations'
    },
    useNullAsDefault: true
  },

};
