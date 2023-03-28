//with mySQL2 we are not closing the connection with the db 
const mysql = require('mysql');
const path = require('path');
const config = require('../../config.js');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') })

// async function query(sql, params) {

// 	try {
// 		const connection = await mysql.createConnection(config.db);
// 		if (connection.state === 'disconnected') throw new Error('rotto');
// 		const [results,] = await connection.execute(sql, params);
// 		return results;
// 	} catch (ex) {
// 		return Error
// 	}

// }

// module.exports = {
// 	query
// }

const connection = mysql.createConnection(config.db);
connection.connect(function(err) {
	if (err) {
	  console.error('error connecting: ' + err.stack);
	  return;
	}
   
	console.log('connected as id ' + connection.threadId);
  });

  connection.end();

 module.exports = {
	connection
 }