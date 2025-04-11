import express from 'express';
import * as authModel from '../models/Auth';
import * as userModel from '../models/User';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// Route pour la connexion
router.post('/login', async (req, res, next) => {
  let conn;
  try {
    const { email, password } = req.body;
    
    // Valider les entrées
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }
    
    console.log(`Tentative de connexion avec email: ${email}`);

    // Version simplifiée pour le développement
    if (process.env.NODE_ENV !== 'production') {
      conn = await db.getConnection();
      const [rows] = await conn.query<RowDataPacket[]>(
        `SELECT u.*, ut.typeName 
         FROM users u 
         JOIN usertypes ut ON u.userTypeId = ut.id 
         WHERE u.email = ?`,
        [email]
      );
      
      if (rows.length === 0) {
        console.log(`Utilisateur ${email} non trouvé`);
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }
      
      const user = rows[0];
      console.log(`Utilisateur trouvé: ${user.firstName} ${user.lastName}`);
      
      // En développement, accepter n'importe quel mot de passe
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
      return res.json({
        user,
        token,
        expiresAt: expiresAt.getTime()
      });
    }

    // Version normale pour la production
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
    console.error('Erreur lors de la connexion:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
});

export default router;