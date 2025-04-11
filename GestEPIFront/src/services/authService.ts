import axios from 'axios';
import { User } from '../types';

const API_URL = 'http://localhost:5500/api';

// Interface pour la réponse d'authentification
export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: number;
}

// Interface pour l'utilisateur connecté
export interface AuthUser extends User {
  token: string;
}

// Fonction de connexion
export const login = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, { email, password });
    const { user, token } = response.data;
    
    // Créer l'objet utilisateur authentifié
    const authUser: AuthUser = {
      ...user,
      token
    };
    
    // Stocker les informations de connexion
    localStorage.setItem('auth_user', JSON.stringify(authUser));
    
    // Configurer le token pour les futures requêtes axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return authUser;
  } catch (error) {
    throw error;
  }
};

// Fonction de déconnexion
export const logout = (): void => {
  localStorage.removeItem('auth_user');
  delete axios.defaults.headers.common['Authorization'];
};

// Fonction pour récupérer l'utilisateur actuellement connecté
export const getCurrentUser = (): AuthUser | null => {
  const userStr = localStorage.getItem('auth_user');
  if (!userStr) return null;
  
  const user: AuthUser = JSON.parse(userStr);
  
  // Configurer le token pour les futures requêtes axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
  
  return user;
};

// Vérifier si l'utilisateur a un rôle spécifique
export const hasRole = (user: AuthUser | null, role: string): boolean => {
  if (!user) return false;
  
  // Vérifier si l'utilisateur a le rôle spécifié
  switch (role) {
    case 'admin':
      return user.userTypeId === 1;
    case 'verificateur':
      return user.userTypeId === 2;
    case 'utilisateur':
      return user.userTypeId === 3;
    default:
      return false;
  }
};

// Intercepteur pour rafraichir le token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (non autorisé) et qu'on n'a pas déjà essayé de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Gérer l'expiration de la session ici (redirection vers la page de connexion)
      logout();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);