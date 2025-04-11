import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from '@mui/material';

// Props pour la route protégée
interface ProtectedRouteProps {
  requiredRoles?: string[];
}

// Composant pour protéger les routes
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, hasPermission } = useAuth();

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si des rôles sont requis, vérifier les permissions
  const hasRequiredPermission = requiredRoles.length === 0 || hasPermission(requiredRoles);
  
  // Si l'utilisateur n'a pas les permissions requises, afficher une alerte
  if (!hasRequiredPermission) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
      </Alert>
    );
  }

  // Rendre les routes enfants
  return <Outlet />;
};

export default ProtectedRoute;