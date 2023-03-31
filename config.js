const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') })

const config = {
    db: {
      connLimit: process.env.CONN_LIMIT,
      host: process.env.DB_HOSTNAME,
      user: process.env.DB_USER, 
      password: process.env.DB_PWD,
      database: process.env.DB_NAME
      //port: process.env.DB_PORT,
    },
    port: process.env.PORT ? process.env.PORT : 3000,
    jwt: process.env.SECRETJWT ? process.env.SECRETJWT : "forzaNapoli",
    listPerPage: 10,
  };
  module.exports = config;