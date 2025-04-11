import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthUser, getCurrentUser, logout as authLogout, hasRole } from '../services/authService';

// Interface pour le contexte d'authentification
interface AuthContextProps {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVerificateur: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  hasPermission: (requiredRoles: string[]) => boolean;
}

// Créer le contexte
const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  isAuthenticated: false,
  isAdmin: false,
  isVerificateur: false,
  login: () => {},
  logout: () => {},
  hasPermission: () => false
});

// Props pour le fournisseur de contexte
interface AuthProviderProps {
  children: ReactNode;
}

// Fournisseur de contexte
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement initial
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  // Fonction de connexion
  const login = (user: AuthUser) => {
    setCurrentUser(user);
  };

  // Fonction de déconnexion
  const logout = () => {
    authLogout();
    setCurrentUser(null);
  };

  // Vérifier si l'utilisateur a la permission requise
  const hasPermission = (requiredRoles: string[]): boolean => {
    if (!currentUser) return false;
    
    return requiredRoles.some(role => {
      return hasRole(currentUser, role);
    });
  };

  // Valeurs du contexte
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser ? currentUser.userTypeId === 1 : false,
    isVerificateur: currentUser ? (currentUser.userTypeId === 1 || currentUser.userTypeId === 2) : false,
    login,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

export default AuthContext;