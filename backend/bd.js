const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',     // Ej: 'root'
  password: 'peluchin24', // Reemplaza con tu contraseña
  database: 'huella_de_carbono',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;