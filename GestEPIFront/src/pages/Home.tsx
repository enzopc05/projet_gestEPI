import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bienvenue sur GestEPI
        </Typography>
        <Typography variant="body1" paragraph>
          Système de gestion des Équipements de Protection Individuelle
        </Typography>
        
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
              <Button variant="contained" color="secondary">
                Vérifications
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
              <Button variant="contained" color="primary">
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