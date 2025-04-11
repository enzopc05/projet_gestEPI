import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Divider
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { getEPIsDueForCheck } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [pendingChecks, setPendingChecks] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentUser, isAuthenticated, isAdmin, isVerificateur, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate(`/users/${currentUser?.id}`);
  };

  useEffect(() => {
    // Ne pas charger les vérifications si l'utilisateur n'est pas connecté ou n'est pas vérificateur
    if (!isAuthenticated || (!isAdmin && !isVerificateur)) {
      return;
    }

    const fetchPendingChecks = async () => {
      try {
        const dueEpis = await getEPIsDueForCheck();
        setPendingChecks(dueEpis.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des vérifications en attente:', error);
      }
    };

    fetchPendingChecks();
    // Actualise toutes les 5 minutes
    const interval = setInterval(fetchPendingChecks, 300000);
    return () => clearInterval(interval);
  }, [isAuthenticated, isAdmin, isVerificateur]);

  // Menu utilisateur
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>
        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
        Mon profil
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
        Déconnexion
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GestEPI
        </Typography>
        
        {isAuthenticated ? (
          <>
            <Box>
              <Button color="inherit" component={RouterLink} to="/">
                Accueil
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/dashboard"
                startIcon={<DashboardIcon />}
              >
                Tableau de bord
              </Button>
              
              {/* Affichage conditionnel en fonction du rôle */}
              {(isAdmin || isVerificateur) && (
                <>
                  <Button color="inherit" component={RouterLink} to="/epis">
                    EPIs
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/checks">
                    Vérifications
                    {pendingChecks > 0 && (
                      <Badge 
                        badgeContent={pendingChecks} 
                        color="error" 
                        sx={{ ml: 1 }}
                      >
                        <NotificationsIcon fontSize="small" />
                      </Badge>
                    )}
                  </Button>
                </>
              )}
              
              {/* Administration des utilisateurs uniquement pour les admins */}
              {isAdmin && (
                <Button color="inherit" component={RouterLink} to="/users">
                  Utilisateurs
                </Button>
              )}
            </Box>
            
            {/* Menu utilisateur connecté */}
            <IconButton
              edge="end"
              aria-label="compte de l'utilisateur"
              aria-controls="menuId"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 2 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                {currentUser?.firstName?.[0] || 'U'}
              </Avatar>
            </IconButton>
            {renderMenu}
          </>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            Connexion
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;