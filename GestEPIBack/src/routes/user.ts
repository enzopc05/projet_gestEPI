import express from 'express';
import * as userModel from '../models/User';

const router = express.Router();

// Route pour obtenir tous les utilisateurs
router.get('/', async (req, res, next) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Route pour obtenir un utilisateur par ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const user = await userModel.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    next(error);
  }
});

// Route pour créer un nouvel utilisateur
router.post('/', async (req, res, next) => {
  try {
    const newUser = await userModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Route pour mettre à jour un utilisateur
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const updatedUser = await userModel.updateUser(id, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Route pour supprimer un utilisateur
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await userModel.deleteUser(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;