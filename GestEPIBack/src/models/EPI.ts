import db from '../config/db';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

export interface EPI {
  id?: number;
  brand: string;
  model: string;
  serialNumber: string;
  size?: string;
  color?: string;
  purchaseDate: Date;
  manufactureDate: Date;
  serviceStartDate: Date;
  periodicity: number;
  epiTypeId: number;
  statusId: number;
  endOfLifeDate?: Date;
}

export async function getAllEPIs() {
  let conn;
  try {
    conn = await db.getConnection();
    const result = await conn.query("SELECT e.*, et.typeName as typeName, es.statusName as statusName FROM epi e JOIN epitypes et ON e.epiTypeId = et.id JOIN epistatus es ON e.statusId = es.id");
    return (result as any[])[0];
  } catch (err) {
    console.error('Erreur lors de la récupération des EPIs:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function getEPIById(id: number) {
  let conn;
  try {
    conn = await db.getConnection();
    const result = await conn.query("SELECT e.*, et.typeName as typeName, es.statusName as statusName FROM epi e JOIN epitypes et ON e.epiTypeId = et.id JOIN epistatus es ON e.statusId = es.id WHERE e.id = ?", [id]);
    return (result as any[])[0][0];
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'EPI:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function createEPI(epi: EPI) {
  let conn;
  try {
    conn = await db.getConnection();
    const [result] = await conn.query<ResultSetHeader>(
      "INSERT INTO epi (brand, model, serialNumber, size, color, purchaseDate, manufactureDate, serviceStartDate, periodicity, epiTypeId, statusId, endOfLifeDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [epi.brand, epi.model, epi.serialNumber, epi.size, epi.color, epi.purchaseDate, epi.manufactureDate, epi.serviceStartDate, epi.periodicity, epi.epiTypeId, epi.statusId, epi.endOfLifeDate]
    );
    
    return { id: result.insertId, ...epi };
  } catch (err) {
    console.error('Erreur lors de la création de l\'EPI:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function updateEPI(id: number, epi: EPI) {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(
      "UPDATE epi SET brand = ?, model = ?, serialNumber = ?, size = ?, color = ?, purchaseDate = ?, manufactureDate = ?, serviceStartDate = ?, periodicity = ?, epiTypeId = ?, statusId = ?, endOfLifeDate = ? WHERE id = ?",
      [epi.brand, epi.model, epi.serialNumber, epi.size, epi.color, epi.purchaseDate, epi.manufactureDate, epi.serviceStartDate, epi.periodicity, epi.epiTypeId, epi.statusId, epi.endOfLifeDate, id]
    );
    return { id, ...epi };
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'EPI:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function deleteEPI(id: number) {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query("DELETE FROM epi WHERE id = ?", [id]);
    return { id };
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'EPI:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}