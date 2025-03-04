import express from 'express';
import * as epiStatusModel from '../models/EPIStatus';

const router = express.Router();

// Route pour obtenir tous les statuts d'EPI
router.get('/', async (req, res, next) => {
  try {
    const epiStatus = await epiStatusModel.getAllEPIStatus();
    res.json(epiStatus);
  } catch (error) {
    next(error);
  }
});

// Route pour obtenir un statut d'EPI par ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const status = await epiStatusModel.getEPIStatusById(id);
    if (status) {
      res.json(status);
    } else {
      res.status(404).json({ message: 'Statut d\'EPI non trouvé' });
    }
  } catch (error) {
    next(error);
  }
});

export default router;