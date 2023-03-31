//with mySQL2 we are not closing the connection with the db 
// const mysql = require('mysql2/promise');
const mysql = require('mysql');
const path = require('path');
const config = require('../../config.js');
const { log } = require('console');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') })

let pool;

async function connect() {
	try{
		pool = mysql.createPool(config.db);
	}catch(err){
		return err.message;
	}
}

async function query(sql, params) {
	try{
		return new Promise((resolve, reject) => {
		pool.getConnection(async function(err, conn) {
			if(err) throw err
				conn.query(sql, params,function(err,results,fields){
					conn.release();
					if(err) return reject(err);
					resolve(results);
				});
			});
		})
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
