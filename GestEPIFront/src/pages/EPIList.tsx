import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  IconButton,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getAllEPIs, deleteEPI } from '../services/api';
import { EPI } from '../types';
import { exportEPIListToPDF, exportEPIListToExcel } from '../services/exportService';

const EPIList: React.FC = () => {
  const [epis, setEpis] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEPIs = async () => {
      try {
        const data = await getAllEPIs();
        setEpis(data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des EPIs:', err);
        setError('Erreur lors du chargement des EPIs');
        setLoading(false);
      }
    };

    fetchEPIs();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet EPI ?')) {
      try {
        await deleteEPI(id);
        setEpis(epis.filter(epi => epi.id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de l\'EPI');
      }
    }
  };

  const handleExportPDF = () => {
    exportEPIListToPDF(epis);
  };

  const handleExportExcel = () => {
    exportEPIListToExcel(epis);
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Liste des EPIs
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<FileDownloadIcon />} 
              onClick={handleExportPDF}
              sx={{ mr: 1 }}
            >
              Exporter PDF
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<FileDownloadIcon />} 
              onClick={handleExportExcel}
            >
              Exporter Excel
            </Button>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            component={RouterLink} 
            to="/epis/new"
          >
            Ajouter un EPI
          </Button>
        </Box>
        
        {epis.length === 0 ? (
          <Alert severity="info">
            Aucun EPI n'a été trouvé. Commencez par ajouter un nouvel équipement.
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="table des EPIs">
              <TableHead>
                <TableRow>
                  <TableCell>Marque</TableCell>
                  <TableCell>Modèle</TableCell>
                  <TableCell>Numéro de série</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {epis.map((epi) => (
                  <TableRow 
                    key={epi.id} 
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <TableCell>{epi.brand}</TableCell>
                    <TableCell>{epi.model}</TableCell>
                    <TableCell>{epi.serialNumber}</TableCell>
                    <TableCell>{epi.typeName}</TableCell>
                    <TableCell>{epi.statusName}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" justifyContent="flex-end">
                        <IconButton 
                          component={RouterLink} 
                          to={`/epis/${epi.id}`}
                          color="primary" 
                          aria-label="voir"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          component={RouterLink} 
                          to={`/epis/edit/${epi.id}`}
                          color="primary" 
                          aria-label="modifier"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          aria-label="supprimer"
                          size="small"
                          onClick={() => epi.id && handleDelete(epi.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default EPIList;