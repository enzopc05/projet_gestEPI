import db from '../config/db';

export async function getEPIStats() {
  let conn;
  try {
    conn = await db.getConnection();
    
    // Statistiques générales
    const epiCountResult = await conn.query("SELECT COUNT(*) as total FROM epi");
    const epiCount = epiCountResult[0].total;
    
    // Répartition par type
    const epiByTypeResult = await conn.query(`
      SELECT et.typeName, COUNT(*) as count 
      FROM epi e 
      JOIN epiTypes et ON e.epiTypeId = et.id 
      GROUP BY e.epiTypeId
      ORDER BY count DESC
    `);
    
    // Répartition par statut
    const epiByStatusResult = await conn.query(`
      SELECT es.statusName, COUNT(*) as count 
      FROM epi e 
      JOIN epiStatus es ON e.statusId = es.id 
      GROUP BY e.statusId
      ORDER BY count DESC
    `);
    
    // Vérifications à venir
    const pendingChecksResult = await conn.query(`
      SELECT COUNT(*) as count,
      SUM(CASE WHEN daysUntilNextCheck <= 0 THEN 1 ELSE 0 END) as urgent,
      SUM(CASE WHEN daysUntilNextCheck > 0 AND daysUntilNextCheck <= 7 THEN 1 ELSE 0 END) as soon,
      SUM(CASE WHEN daysUntilNextCheck > 7 AND daysUntilNextCheck <= 30 THEN 1 ELSE 0 END) as upcoming
      FROM (
        SELECT e.id,
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
        WHERE e.statusId = 1
      ) as checks_due
      WHERE daysUntilNextCheck <= 30
    `);
    
    // Historique des vérifications par mois (12 derniers mois)
    const checksHistoryResult = await conn.query(`
      SELECT 
        DATE_FORMAT(checkDate, '%Y-%m') as month,
        COUNT(*) as count
      FROM epi_Check
      WHERE checkDate >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);
    
    return {
      epiCount,
      epiByType: epiByTypeResult,
      epiByStatus: epiByStatusResult,
      pendingChecks: pendingChecksResult[0],
      checksHistory: checksHistoryResult
    };
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}