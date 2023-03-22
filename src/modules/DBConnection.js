//with mySQL2 we are not closing the connection with the db 
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

//setting data for the sql connection
let connection = mysql.createConnection({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USER, 
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

module.exports = {connection}