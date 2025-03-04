import express from 'express';
import * as epiTypeModel from '../models/EPIType';

const router = express.Router();

// Route pour obtenir tous les types d'EPI
router.get('/', async (req, res, next) => {
  try {
    const epiTypes = await epiTypeModel.getAllEPITypes();
    res.json(epiTypes);
  } catch (error) {
    next(error);
  }
});

// Route pour obtenir un type d'EPI par ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const epiType = await epiTypeModel.getEPITypeById(id);
    if (epiType) {
      res.json(epiType);
    } else {
      res.status(404).json({ message: 'Type d\'EPI non trouvé' });
    }
  } catch (error) {
    next(error);
  }
});

export default router;