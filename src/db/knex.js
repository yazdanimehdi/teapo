const electron = window.require('electron');
const app = (electron.app || electron.remote.app);

let knex = require('knex')(
    {client: 'sqlite3',
    connection: {
        filename: `${app.getPath('userData')}/database.sqlite`
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './src/db/migrations'
    },
    useNullAsDefault: true}
    )


module.exports = knex;