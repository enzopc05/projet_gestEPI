import express from 'express';
import * as epiCheckModel from '../models/EPICheck';

const router = express.Router();

// Route pour obtenir toutes les vérifications
router.get('/', async (req, res, next) => {
  try {
    const checks = await epiCheckModel.getAllEPIChecks();
    res.json(checks);
  } catch (error) {
    next(error);
  }
});

// Route pour obtenir les EPIs à vérifier prochainement
router.get('/due', async (req, res, next) => {
  try {
    const dueChecks = await epiCheckModel.getEPIsDueForCheck();
    res.json(dueChecks);
  } catch (error) {
    next(error);
  }
});

// Route pour obtenir une vérification par ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const check = await epiCheckModel.getEPICheckById(id);
    if (check) {
      res.json(check);
    } else {
      res.status(404).json({ message: 'Vérification non trouvée' });
    }
  } catch (error) {
    next(error);
  }
});

// Route pour obtenir les vérifications d'un EPI spécifique
router.get('/epi/:epiId', async (req, res, next) => {
  try {
    const epiId = parseInt(req.params.epiId);
    const checks = await epiCheckModel.getEPIChecksByEPIId(epiId);
    res.json(checks);
  } catch (error) {
    next(error);
  }
});

// Route pour créer une nouvelle vérification
router.post('/', async (req, res, next) => {
  try {
    const newCheck = await epiCheckModel.createEPICheck(req.body);
    res.status(201).json(newCheck);
  } catch (error) {
    next(error);
  }
});

// Route pour mettre à jour une vérification
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const updatedCheck = await epiCheckModel.updateEPICheck(id, req.body);
    res.json(updatedCheck);
  } catch (error) {
    next(error);
  }
});

// Route pour supprimer une vérification
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await epiCheckModel.deleteEPICheck(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;