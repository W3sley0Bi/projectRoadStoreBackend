require('dotenv').config()

const config = {
    db: {
      connectionLimit : 100, //important
      host: `${process.env.DB_HOSTNAME}`,
      user: `${process.env.DB_USER}`, 
      password: `${process.env.DB_PWD}`,
      port: `${process.env.DB_PORT}`,
      database: `${process.env.DB_NAME}`
    },
    listPerPage: 10,
  };
  module.exports = config;