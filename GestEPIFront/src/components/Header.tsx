import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Ajouté
import { useEffect, useState } from 'react';
import { getEPIsDueForCheck } from '../services/api';

const Header = () => {
  const [pendingChecks, setPendingChecks] = useState(0);

  useEffect(() => {
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
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GestEPI
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Accueil
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/dashboard"
            startIcon={<DashboardIcon />} // Ajouté
          >
            Tableau de bord
          </Button>
          <Button color="inherit" component={RouterLink} to="/epis">
            EPIs
          </Button>
          <Button color="inherit" component={RouterLink} to="/users">
  Utilisateurs
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
          
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;