import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Création du pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'gestEPI',
  connectionLimit: 5
});

// Fonction pour obtenir une connexion du pool
async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (err) {
    console.error('Erreur de connexion à la base de données:', err);
    throw err;
  }
}

export default { getConnection };