import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extension de l'interface Request pour y ajouter l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        userTypeId: number;
      };
    }
  }
}

// Middleware pour vérifier l'authentification
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Récupérer le token du header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès non autorisé. Token requis.' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
    
    // Ajouter les informations utilisateur à la requête
    req.user = {
      userId: decoded.userId,
      userTypeId: decoded.userTypeId
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

// Middleware pour vérifier les rôles
export const authorize = (allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Accès non autorisé. Authentification requise.' });
    }

    if (allowedRoles.includes(req.user.userTypeId)) {
      next();
    } else {
      res.status(403).json({ message: 'Accès interdit. Vous n\'avez pas les autorisations nécessaires.' });
    }
  };
};