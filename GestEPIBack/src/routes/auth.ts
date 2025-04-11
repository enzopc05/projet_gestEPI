import express from 'express';
import * as authModel from '../models/Auth';
import * as userModel from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Route pour la connexion
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Valider les entrées
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérifier l'authentification
    const user = await authModel.authenticate(email, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, userTypeId: user.userTypeId },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '8h' }
    );

    // Date d'expiration du token
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);

    // Retourner les informations utilisateur et le token
    res.json({
      user,
      token,
      expiresAt: expiresAt.getTime()
    });
  } catch (error) {
    next(error);
  }
});

// Route pour vérifier le token JWT
router.get('/me', async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou invalide' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
      
      // Récupérer les informations utilisateur
      const user = await userModel.getUserById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      // Retourner les informations utilisateur
      res.json({ user });
    } catch (err) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  } catch (error) {
    next(error);
  }
});

export default router;