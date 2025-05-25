require('dotenv').config();
const mysql = require('mysql2/promise');

//with env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port:process.env.DB_PORT,
  database: "bincomphptest",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//without env or locally
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "bincomphptest",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database!');
    connection.release();
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1);
  }
}

module.exports = { pool, testDbConnection };