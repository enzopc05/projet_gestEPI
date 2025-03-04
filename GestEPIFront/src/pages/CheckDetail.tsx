import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Button, Chip } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEPICheckById, deleteEPICheck } from '../services/api';
import { EPICheck } from '../types';

const CheckDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [check, setCheck] = useState<EPICheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCheck = async () => {
      try {
        if (id) {
          const data = await getEPICheckById(parseInt(id));
          setCheck(data);
        }
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des détails de la vérification');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCheck();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vérification ?')) {
      try {
        if (check && check.id) {
          await deleteEPICheck(check.id);
          navigate('/checks');
        }
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de la vérification');
      }
    }
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!check) return <Typography>Vérification non trouvée</Typography>;

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Détails de la vérification
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Vérification du {formatDate(check.checkDate)}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Équipement:</strong> {check.epiSerialNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Vérificateur:</strong> {check.userName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      <strong>Statut:</strong>
                    </Typography>
                    <Chip 
                      label={check.statusName} 
                      color={
                        check.statusId === 1 ? 'success' : 
                        check.statusId === 2 ? 'warning' : 'error'
                      } 
                      variant="outlined" 
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
              
              {check.remarks && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Remarques:</strong>
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                    {check.remarks}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/checks')}>
            Retour à la liste
          </Button>
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mr: 1 }} 
              onClick={() => navigate(`/checks/edit/${check.id}`)}
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

export default CheckDetail;