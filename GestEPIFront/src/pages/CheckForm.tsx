import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper, 
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import fr from 'date-fns/locale/fr';
import { createEPICheck, getEPICheckById, updateEPICheck, getAllEPIs, getAllUsers, getAllEPIStatus } from '../services/api';
import { EPICheck, EPI, User, EPIStatus } from '../types';

const CheckForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const epiIdParam = queryParams.get('epiId');
  
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Partial<EPICheck>>({
    checkDate: new Date(),
    userId: 0,
    epiId: epiIdParam ? parseInt(epiIdParam) : 0,
    statusId: 1, // Par défaut: Opérationnel
    remarks: ''
  });

  const [epis, setEpis] = useState<EPI[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<EPIStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chargement des données nécessaires
        const [episData, usersData, statusesData] = await Promise.all([
          getAllEPIs(),
          getAllUsers(),
          getAllEPIStatus()
        ]);
        
        console.log("Statuts récupérés:", statusesData);
        
        // Filtrer les utilisateurs pour ne garder que les vérificateurs (userTypeId = 2) et admins (userTypeId = 1)
        const filteredUsers = usersData.filter(user => user.userTypeId === 1 || user.userTypeId === 2);
        
        setEpis(episData);
        setUsers(filteredUsers); // Utiliser la liste filtrée
        setStatuses(statusesData);

        // Si en mode édition, charger les détails de la vérification
        if (isEditMode && id) {
          const checkData = await getEPICheckById(parseInt(id));
          const formattedData = {
            ...checkData,
            checkDate: checkData.checkDate ? new Date(checkData.checkDate) : undefined
          };
          setFormData(formattedData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, epiIdParam]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.checkDate) errors.checkDate = 'La date est requise';
    if (!formData.userId) errors.userId = 'Le vérificateur est requis';
    if (!formData.epiId) errors.epiId = 'L\'équipement est requis';
    if (!formData.statusId) errors.statusId = 'Le statut est requis';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditMode && id) {
        await updateEPICheck(parseInt(id), formData as EPICheck);
      } else {
        await createEPICheck(formData as EPICheck);
      }
      
      navigate('/checks');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError('Erreur lors de l\'enregistrement de la vérification');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: parseInt(value) || 0 }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prevData => ({ ...prevData, checkDate: date }));
    }
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Modifier la vérification' : 'Nouvelle vérification'}
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <Grid item xs={12}>
                  <DatePicker
                    label="Date de vérification"
                    value={formData.checkDate instanceof Date ? formData.checkDate : null}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!formErrors.checkDate,
                        helperText: formErrors.checkDate
                      }
                    }}
                  />
                </Grid>
              </LocalizationProvider>
              
              <Grid item xs={12}>
                <FormControl fullWidth required error={!!formErrors.epiId}>
                  <InputLabel>Équipement</InputLabel>
                  <Select
                    name="epiId"
                    value={formData.epiId?.toString() || ''}
                    onChange={handleSelectChange}
                    label="Équipement"
                    disabled={!!epiIdParam}
                  >
                    {epis.map(epi => (
                      <MenuItem key={epi.id} value={epi.id?.toString()}>
                        {epi.brand} {epi.model} - {epi.serialNumber}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.epiId && <FormHelperText>{formErrors.epiId}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required error={!!formErrors.userId}>
                  <InputLabel>Vérificateur</InputLabel>
                  <Select
                    name="userId"
                    value={formData.userId?.toString() || ''}
                    onChange={handleSelectChange}
                    label="Vérificateur"
                  >
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.id?.toString()}>
                        {user.firstName} {user.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.userId && <FormHelperText>{formErrors.userId}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required error={!!formErrors.statusId}>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    name="statusId"
                    value={formData.statusId?.toString() || ''}
                    onChange={handleSelectChange}
                    label="Statut"
                  >
                    {statuses.length > 0 ? (
                      statuses.map(status => (
                        <MenuItem key={status.id} value={status.id?.toString()}>
                          {status.statusName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Aucun statut disponible</MenuItem>
                    )}
                  </Select>
                  {formErrors.statusId && <FormHelperText>{formErrors.statusId}</FormHelperText>}
                  {statuses.length === 0 && <FormHelperText>Aucun statut trouvé dans la base de données</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Remarques"
                  name="remarks"
                  value={formData.remarks || ''}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/checks')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CheckForm;