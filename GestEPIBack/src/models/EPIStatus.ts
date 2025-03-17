import db from '../config/db';
import { RowDataPacket } from 'mysql2';

export interface EPIStatus {
  id?: number;
  statusName: string;
}

export async function getAllEPIStatus() {
  let conn;
  try {
    conn = await db.getConnection();
    const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM epistatus");
    return rows;
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
    const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM epistatus WHERE id = ?", [id]);
    return rows[0];
  } catch (err) {
    console.error('Erreur lors de la récupération du statut d\'EPI:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}