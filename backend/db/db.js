import knex from "knex";

const connectedKnex = knex({
    client: 'sqlite3',
    connection: {
        filename: 'zotipy.sqlite3'
    }
})

export default connectedKnex
