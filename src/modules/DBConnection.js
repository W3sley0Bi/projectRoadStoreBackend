//with mySQL2 we are not closing the connection with the db 
// const mysql = require('mysql2/promise');
const mysql = require('mysql');
const path = require('path');
const config = require('../../config.js');

require('dotenv').config({ path: path.join(__dirname, '../../../.env') })


const db = mysql.createPool(config.db);

 module.exports = {
	db
 }