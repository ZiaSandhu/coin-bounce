const mongose= require('mongoose')

const {conn_string}  = require('../config/index') 

const dbconnect = async () => {
    try {
        const con = await mongose.connect(conn_string);
        console.log(`Database connected to host ${con.connection.host}`)
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}

module.exports = dbconnect