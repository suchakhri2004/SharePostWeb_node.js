const knex = require('knex');

const db = knex.default({
    client: 'mysql2',
    connection: {
        user: 'root',
        password: '1234',
        host: 'localhost',
        port: 3306,
        database: 'sharepost'
    }

});

module.exports = db;