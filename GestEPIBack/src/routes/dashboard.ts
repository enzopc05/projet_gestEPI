import express from 'express';
import * as dashboardModel from '../models/Dashboard';

const router = express.Router();

// Route pour obtenir les statistiques du tableau de bord
router.get('/', async (req, res, next) => {
  try {
    const stats = await dashboardModel.getEPIStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;