// GestEPIFront/src/pages/CheckList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Tabs, Tab } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import format from 'date-fns/format';
import fr from 'date-fns/locale/fr';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getAllEPIChecks, getEPIsDueForCheck, deleteEPICheck } from '../services/api';
import { EPICheck, EPI } from '../types';

// Fonctions d'exportation temporaires (à remplacer par les véritables fonctions)
const exportChecksToPDF = (checks: EPICheck[]) => {
  alert('Exportation PDF non implémentée');
  console.log('Checks à exporter:', checks);
};

const exportChecksToExcel = (checks: EPICheck[]) => {
  alert('Exportation Excel non implémentée');
  console.log('Checks à exporter:', checks);
};

const CheckList = () => {
  const [checks, setChecks] = useState<EPICheck[]>([]);
  const [dueEPIs, setDueEPIs] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Vérifier si un onglet spécifique est demandé dans l'URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setTabValue(parseInt(tabParam));
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (tabValue === 0) {
          const checksData = await getAllEPIChecks();
          setChecks(checksData);
        } else {
          const dueData = await getEPIsDueForCheck();
          setDueEPIs(dueData);
        }
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchData();
  }, [tabValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vérification ?')) {
      try {
        await deleteEPICheck(id);
        setChecks(checks.filter(check => check.id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de la vérification');
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestion des vérifications
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Historique des vérifications" />
            <Tab label="Vérifications à effectuer" />
          </Tabs>
        </Box>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {tabValue === 0 && (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Button 
                  variant="outlined" 
                  startIcon={<FileDownloadIcon />} 
                  onClick={() => exportChecksToPDF(checks)}
                  sx={{ mr: 1 }}
                >
                  Exporter PDF
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<FileDownloadIcon />} 
                  onClick={() => exportChecksToExcel(checks)}
                >
                  Exporter Excel
                </Button>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                component={RouterLink} 
                to="/checks/new"
              >
                Nouvelle vérification
              </Button>
            </Box>
            
            {checks.length === 0 ? (
              <Typography variant="body1">Aucune vérification trouvée.</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="table des vérifications">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Équipement</TableCell>
                      <TableCell>Vérificateur</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {checks.map((check) => (
                      <TableRow key={check.id}>
                        <TableCell>{formatDate(check.checkDate)}</TableCell>
                        <TableCell>{check.epiSerialNumber}</TableCell>
                        <TableCell>{check.userName}</TableCell>
                        <TableCell>{check.statusName}</TableCell>
                        <TableCell>
                          <IconButton 
                            component={RouterLink} 
                            to={`/checks/${check.id}`}
                            color="primary" 
                            aria-label="voir"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton 
                            component={RouterLink} 
                            to={`/checks/edit/${check.id}`}
                            color="primary" 
                            aria-label="modifier"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            aria-label="supprimer"
                            onClick={() => check.id && handleDelete(check.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        
        {tabValue === 1 && (
          <>
            {dueEPIs.length === 0 ? (
              <Typography variant="body1">Aucune vérification à effectuer pour le moment.</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="table des EPIs à vérifier">
                  <TableHead>
                    <TableRow>
                      <TableCell>Priorité</TableCell>
                      <TableCell>Équipement</TableCell>
                      <TableCell>Numéro de série</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Jours restants</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dueEPIs.map((epi) => (
                      <TableRow 
                        key={epi.id}
                        sx={{ 
                          backgroundColor: (epi.daysUntilNextCheck || 0) <= 0 
                            ? '#ffcccc' 
                            : (epi.daysUntilNextCheck || 0) <= 7 
                              ? '#fff4cc' 
                              : 'inherit'
                        }}
                      >
                        <TableCell>
                          {(epi.daysUntilNextCheck || 0) <= 0 && (
                            <WarningIcon color="error" fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                          )}
                          {(epi.daysUntilNextCheck || 0) <= 0 ? 'Urgent' : (epi.daysUntilNextCheck || 0) <= 7 ? 'Haute' : 'Normale'}
                        </TableCell>
                        <TableCell>{epi.brand} {epi.model}</TableCell>
                        <TableCell>{epi.serialNumber}</TableCell>
                        <TableCell>{epi.typeName}</TableCell>
                        <TableCell>
                          {(epi.daysUntilNextCheck || 0) <= 0 
                            ? `En retard de ${Math.abs(epi.daysUntilNextCheck || 0)} jours` 
                            : `${epi.daysUntilNextCheck} jours`}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="contained" 
                            color="primary"
                            component={RouterLink}
                            to={`/checks/new?epiId=${epi.id}`}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            Vérifier
                          </Button>
                          <IconButton 
                            component={RouterLink} 
                            to={`/epis/${epi.id}`}
                            color="primary" 
                            aria-label="voir"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default CheckList;