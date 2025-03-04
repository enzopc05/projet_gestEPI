import db from '../config/db';

export interface EPIType {
  id?: number;
  typeName: string;
  isTextile: boolean;
}

export async function getAllEPITypes() {
  let conn;
  try {
    conn = await db.getConnection();
    return await conn.query("SELECT * FROM epiTypes");
  } catch (err) {
    console.error('Erreur lors de la récupération des types d\'EPI:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function getEPITypeById(id: number) {
  let conn;
  try {
    conn = await db.getConnection();
    const results = await conn.query("SELECT * FROM epiTypes WHERE id = ?", [id]);
    return results[0];
  } catch (err) {
    console.error('Erreur lors de la récupération du type d\'EPI:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}