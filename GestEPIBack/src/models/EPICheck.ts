import db from '../config/db';

export interface EPICheck {
  id?: number;
  checkDate: Date;
  userId: number;
  epiId: number;
  statusId: number;
  remarks?: string;
}

export async function getAllEPIChecks() {
  let conn;
  try {
    conn = await db.getConnection();
    const [rows] = await conn.query(`
      SELECT ec.*, 
        CONCAT(u.firstName, ' ', u.lastName) as userName, 
        e.serialNumber as epiSerialNumber,
        es.statusName as statusName,
        DATE_FORMAT(ec.checkDate, '%Y-%m-%d') as checkDate
      FROM epi_check ec 
      JOIN users u ON ec.userId = u.id 
      JOIN epi e ON ec.epiId = e.id
      JOIN epistatus es ON ec.statusId = es.id
      ORDER BY ec.checkDate DESC
    `);
    return rows;
  } catch (err) {
    console.error('Erreur lors de la récupération des vérifications:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function getEPICheckById(id: number) {
  let conn;
  try {
    conn = await db.getConnection();
    const results = await conn.query(`
      SELECT ec.*, 
        CONCAT(u.firstName, ' ', u.lastName) as userName, 
        e.serialNumber as epiSerialNumber,
        es.statusName as statusName
      FROM epi_Check ec 
      JOIN users u ON ec.userId = u.id 
      JOIN epi e ON ec.epiId = e.id
      JOIN epiStatus es ON ec.statusId = es.id
      WHERE ec.id = ?
    `, [id]);
    return results[0];
  } catch (err) {
    console.error('Erreur lors de la récupération de la vérification:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function getEPIChecksByEPIId(epiId: number) {
  let conn;
  try {
    conn = await db.getConnection();
    return await conn.query(`
      SELECT ec.*, 
        CONCAT(u.firstName, ' ', u.lastName) as userName,
        es.statusName as statusName
      FROM epi_Check ec 
      JOIN users u ON ec.userId = u.id
      JOIN epiStatus es ON ec.statusId = es.id
      WHERE ec.epiId = ?
      ORDER BY ec.checkDate DESC
    `, [epiId]);
  } catch (err) {
    console.error('Erreur lors de la récupération des vérifications pour cet EPI:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function createEPICheck(check: EPICheck) {
  let conn;
  try {
    conn = await db.getConnection();
    const [result] = await conn.query(
      "INSERT INTO epi_check (checkDate, userId, epiId, statusId, remarks) VALUES (?, ?, ?, ?, ?)",
      [check.checkDate, check.userId, check.epiId, check.statusId, check.remarks]
    );
    return { id: (result as any).insertId, ...check };
  } catch (err) {
    console.error('Erreur lors de la création de la vérification:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function updateEPICheck(id: number, check: EPICheck) {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(
      "UPDATE epi_Check SET checkDate = ?, userId = ?, epiId = ?, statusId = ?, remarks = ? WHERE id = ?",
      [check.checkDate, check.userId, check.epiId, check.statusId, check.remarks, id]
    );
    return { id, ...check };
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la vérification:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function deleteEPICheck(id: number) {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query("DELETE FROM epi_Check WHERE id = ?", [id]);
    return { id };
  } catch (err) {
    console.error('Erreur lors de la suppression de la vérification:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function getEPIsDueForCheck() {
  let conn;
  try {
    conn = await db.getConnection();
    const currentDate = new Date();
    
    // Récupérer les EPIs qui doivent être vérifiés (date de dernière vérification + périodicité < aujourd'hui)
    return await conn.query(`
      SELECT e.*, et.typeName, es.statusName,
        DATEDIFF(
          DATE_ADD(
            IFNULL(
              (SELECT MAX(ec.checkDate) FROM epi_Check ec WHERE ec.epiId = e.id),
              e.serviceStartDate
            ),
            INTERVAL e.periodicity MONTH
          ),
          CURDATE()
        ) as daysUntilNextCheck
      FROM epi e
      JOIN epiTypes et ON e.epiTypeId = et.id
      JOIN epiStatus es ON e.statusId = es.id
      WHERE 
        e.statusId = 1 AND
        DATEDIFF(
          DATE_ADD(
            IFNULL(
              (SELECT MAX(ec.checkDate) FROM epi_Check ec WHERE ec.epiId = e.id),
              e.serviceStartDate
            ),
            INTERVAL e.periodicity MONTH
          ),
          CURDATE()
        ) <= 30
      ORDER BY daysUntilNextCheck ASC
    `);
  } catch (err) {
    console.error('Erreur lors de la récupération des EPIs à vérifier:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}