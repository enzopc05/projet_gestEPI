import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { EPI } from '../types';

const EPIList = () => {
  const [epis, setEpis] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEPIs = async () => {
      try {
        const response = await axios.get('http://localhost:5500/api/epis');
        setEpis(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des EPIs');
        setLoading(false);
        console.error(err);
      }
    };

    fetchEPIs();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet EPI ?')) {
      try {
        await axios.delete(`http://localhost:5500/api/epis/${id}`);
        setEpis(epis.filter(epi => epi.id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de l\'EPI');
      }
    }
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Liste des EPIs
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary" 
            component={RouterLink} 
            to="/epis/new"
          >
            Ajouter un EPI
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="table des EPIs">
            <TableHead>
              <TableRow>
                <TableCell>Marque</TableCell>
                <TableCell>Modèle</TableCell>
                <TableCell>Numéro de série</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {epis.map((epi) => (
                <TableRow key={epi.id}>
                  <TableCell>{epi.brand}</TableCell>
                  <TableCell>{epi.model}</TableCell>
                  <TableCell>{epi.serialNumber}</TableCell>
                  <TableCell>{epi.typeName}</TableCell>
                  <TableCell>{epi.statusName}</TableCell>
                  <TableCell>
                    <IconButton 
                      component={RouterLink} 
                      to={`/epis/${epi.id}`}
                      color="primary" 
                      aria-label="voir"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      component={RouterLink} 
                      to={`/epis/edit/${epi.id}`}
                      color="primary" 
                      aria-label="modifier"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      aria-label="supprimer"
                      onClick={() => epi.id && handleDelete(epi.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default EPIList;