import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Paper, Alert, AlertTitle } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Ajouté pour l'icône du tableau de bord
import { getEPIsDueForCheck } from '../services/api';
import { EPI } from '../types';

const Home = () => {
  const [dueEPIs, setDueEPIs] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDueChecks = async () => {
      try {
        const epis = await getEPIsDueForCheck();
        setDueEPIs(epis);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des vérifications à effectuer:', error);
        setLoading(false);
      }
    };

    fetchDueChecks();
  }, []);

  const urgentChecks = dueEPIs.filter(epi => epi.daysUntilNextCheck <= 0).length;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bienvenue sur GestEPI
        </Typography>
        <Typography variant="body1" paragraph>
          Système de gestion des Équipements de Protection Individuelle
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          component={RouterLink}
          to="/dashboard"
          startIcon={<DashboardIcon />}
          sx={{ mt: 2, mb: 4 }}
        >
          Accéder au tableau de bord
        </Button>
        
        {!loading && urgentChecks > 0 && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                component={RouterLink} 
                to="/checks?tab=1"
              >
                Voir
              </Button>
            }
          >
            <AlertTitle>Vérifications urgentes</AlertTitle>
            {urgentChecks} équipement{urgentChecks > 1 ? 's' : ''} nécessite{urgentChecks > 1 ? 'nt' : ''} une vérification immédiate.
          </Alert>
        )}
        
        {!loading && dueEPIs.length > 0 && urgentChecks === 0 && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                component={RouterLink} 
                to="/checks?tab=1"
              >
                Voir
              </Button>
            }
          >
            <AlertTitle>Vérifications à venir</AlertTitle>
            {dueEPIs.length} équipement{dueEPIs.length > 1 ? 's' : ''} à vérifier dans les 30 prochains jours.
          </Alert>
        )}
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Gestion des EPIs
              </Typography>
              <Typography variant="body2" paragraph>
                Consultez, ajoutez et modifiez les équipements de protection individuelle.
              </Typography>
              <Button variant="contained" component={RouterLink} to="/epis">
                Voir les EPIs
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Vérifications
              </Typography>
              <Typography variant="body2" paragraph>
                Effectuez et consultez les vérifications périodiques des équipements.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                component={RouterLink}
                to="/checks"
                startIcon={dueEPIs.length > 0 ? <WarningIcon /> : undefined}
              >
                Vérifications
                {dueEPIs.length > 0 ? ` (${dueEPIs.length})` : ''}
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Utilisateurs
              </Typography>
              <Typography variant="body2" paragraph>
                Gérez les utilisateurs et leurs accès au système.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                component={RouterLink}
                to="/users"
              >
                Utilisateurs
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;