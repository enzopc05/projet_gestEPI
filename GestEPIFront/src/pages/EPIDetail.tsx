import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Button, Chip } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEPIById, deleteEPI } from '../services/api';
import { EPI } from '../types';

const EPIDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [epi, setEpi] = useState<EPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEPI = async () => {
      try {
        if (id) {
          const data = await getEPIById(parseInt(id));
          setEpi(data);
        }
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des détails de l\'EPI');
        setLoading(false);
        console.error(err);
      }
    };

    fetchEPI();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet EPI ?')) {
      try {
        if (epi && epi.id) {
          await deleteEPI(epi.id);
          navigate('/epis');
        }
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de l\'EPI');
      }
    }
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!epi) return <Typography>EPI non trouvé</Typography>;

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Détails de l'EPI
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">
                {epi.brand} {epi.model}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Numéro de série: {epi.serialNumber}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label={epi.typeName || 'Type inconnu'} 
                  color="primary" 
                  variant="outlined" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={epi.statusName || 'Statut inconnu'} 
                  color={epi.statusId === 1 ? 'success' : epi.statusId === 2 ? 'warning' : 'error'} 
                  variant="outlined" 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              {epi.size && (
                <Typography variant="body2">
                  <strong>Taille:</strong> {epi.size}
                </Typography>
              )}
              {epi.color && (
                <Typography variant="body2">
                  <strong>Couleur:</strong> {epi.color}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Date d'achat:</strong> {formatDate(epi.purchaseDate)}
              </Typography>
              <Typography variant="body2">
                <strong>Date de fabrication:</strong> {formatDate(epi.manufactureDate)}
              </Typography>
              <Typography variant="body2">
                <strong>Date de mise en service:</strong> {formatDate(epi.serviceStartDate)}
              </Typography>
              <Typography variant="body2">
                <strong>Périodicité de vérification:</strong> {epi.periodicity} mois
              </Typography>
              {epi.endOfLifeDate && (
                <Typography variant="body2">
                  <strong>Date de fin de vie:</strong> {formatDate(epi.endOfLifeDate)}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/epis')}>
            Retour à la liste
          </Button>
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mr: 1 }} 
              onClick={() => navigate(`/epis/edit/${epi.id}`)}
            >
              Modifier
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default EPIDetail;