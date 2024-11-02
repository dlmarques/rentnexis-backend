const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

//Test DB connection
pool.connect((err, client, release) => {
  if (err) return console.error("Error acquiring client", err.stack);
  console.log("Connected to database");
  release();
});

module.exports = pool;
