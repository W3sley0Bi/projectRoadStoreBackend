//with mySQL2 we are not closing the connection with the db 
// const mysql = require('mysql2/promise');
const mysql = require('mysql');
const path = require('path');
const config = require('../../config.js');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') })

async function connect() {
	try{
		const conn = await mysql.createPool(config.db);
		console.log('connected');
		return conn;
	}catch(err){
		return err.message;
	}
}


async function query(sql, params) {
	const conn = await connect();
	try{
		return new Promise((resolve, reject) => {
			conn.query(sql, params,function(err,results,fields){
				if(err) return reject(err);
				resolve(results);
			});
		});
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
