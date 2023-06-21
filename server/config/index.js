const dotenv = require('dotenv').config()

const port = process.env.PORT
const conn_string = process.env.DB_CONNECTION_STRING
const backend_server_path = process.env.BACKEND_SERVER_PATH
module.exports = {
    port,
    conn_string,
    backend_server_path
}