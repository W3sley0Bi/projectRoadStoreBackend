//with mySQL2 we are not closing the connection with the db 
// const mysql = require('mysql2/promise');
const mysql = require('mysql');
const path = require('path');
const config = require('../../config.js');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') })

async function connect() {
	try{
		const conn = mysql.createPool(config.db);
		return conn;
	}catch(err){
		return err.message;
	}
}

async function query(sql, params) {
	const conn = await connect();
	try{
		return await conn.query(sql, params);
	}catch(err){
		return err.message;
	}
}

// async function queryWcb(sql, params) {
// 	const conn = await connect();
// 	try{
// 		await conn.execute(sql, params);
// 	}catch(err){
// 		return err.message;
// 	}
// }

module.exports = {
	connect,
	query,
	// queryWcb
}
