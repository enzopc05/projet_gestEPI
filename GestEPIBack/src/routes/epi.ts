import express from 'express';
import * as epiModel from '../models/EPI';

const router = express.Router();

// Route pour obtenir tous les EPIs
router.get('/', async (req, res, next) => {
  try {
    const epis = await epiModel.getAllEPIs();
    res.json(epis);
  } catch (error) {
    next(error);
  }
});

// Route pour obtenir un EPI par ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const epi = await epiModel.getEPIById(id);
    if (epi) {
      res.json(epi);
    } else {
      res.status(404).json({ message: 'EPI non trouvé' });
    }
  } catch (error) {
    next(error);
  }
});

// Route pour créer un nouvel EPI
router.post('/', async (req, res, next) => {
  try {
    const newEpi = await epiModel.createEPI(req.body);
    res.status(201).json(newEpi);
  } catch (error) {
    next(error);
  }
});

// Route pour mettre à jour un EPI
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const updatedEpi = await epiModel.updateEPI(id, req.body);
    res.json(updatedEpi);
  } catch (error) {
    next(error);
  }
});

// Route pour supprimer un EPI
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await epiModel.deleteEPI(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;