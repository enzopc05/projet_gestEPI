import db from '../config/db';

export interface EPIStatus {
  id?: number;
  statusName: string;
}

export async function getAllEPIStatus() {
  let conn;
  try {
    conn = await db.getConnection();
    return await conn.query("SELECT * FROM epiStatus");
  } catch (err) {
    console.error('Erreur lors de la récupération des statuts d\'EPI:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function getEPIStatusById(id: number) {
  let conn;
  try {
    conn = await db.getConnection();
    const results = await conn.query("SELECT * FROM epiStatus WHERE id = ?", [id]);
    return results[0];
  } catch (err) {
    console.error('Erreur lors de la récupération du statut d\'EPI:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}