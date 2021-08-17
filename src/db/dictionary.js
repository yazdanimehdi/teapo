const electron = require('electron');
const app = (electron.app || electron.remote.app);

let knex = require('knex')(
    {client: 'sqlite3',
        connection: {
            filename: `${app.getPath('userData')}/longman.sqlite`
        },
        useNullAsDefault: true}
)


module.exports = knex;