const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables

// Create MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "jtanui",
    password: process.env.DB_PASS || "Arc10.6GIS",
    database: process.env.DB_NAME || "staff",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check MySQL connection
db.getConnection((err, connection) => {
  if (err) {
    console.error(" MySQL Connection Failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL as jtanui");
  connection.release(); // Release connection back to pool
});

module.exports = db;
