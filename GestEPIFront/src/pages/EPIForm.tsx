import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { fr } from 'date-fns/locale';
import { createEPI, getEPIById, updateEPI, getAllEPITypes, getAllEPIStatus } from '../services/api';
import { EPI, EPIType, EPIStatus } from '../types';

const EPIForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Partial<EPI>>({
    brand: '',
    model: '',
    serialNumber: '',
    size: '',
    color: '',
    purchaseDate: new Date(),
    manufactureDate: new Date(),
    serviceStartDate: new Date(),
    periodicity: 12, // Valeur par défaut: 12 mois
    epiTypeId: 0,
    statusId: 1, // Par défaut: Opérationnel
    endOfLifeDate: undefined
  });

  const [epiTypes, setEpiTypes] = useState<EPIType[]>([]);
  const [epiStatuses, setEpiStatuses] = useState<EPIStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

// Dans la fonction qui charge les données
useEffect(() => {
    const fetchData = async () => {
      try {
        // Chargement des types et statuts d'EPI
        const [typesData, statusesData] = await Promise.all([
          getAllEPITypes(),
          getAllEPIStatus()
        ]);
        
        setEpiTypes(typesData);
        setEpiStatuses(statusesData);
  
        // Si en mode édition, charger les détails de l'EPI
        if (isEditMode && id) {
          const epiData = await getEPIById(parseInt(id));
          // Convertir les dates en objets Date, utiliser undefined au lieu de null
          const formattedData = {
            ...epiData,
            purchaseDate: epiData.purchaseDate ? new Date(epiData.purchaseDate) : undefined,
            manufactureDate: epiData.manufactureDate ? new Date(epiData.manufactureDate) : undefined,
            serviceStartDate: epiData.serviceStartDate ? new Date(epiData.serviceStartDate) : undefined,
            endOfLifeDate: epiData.endOfLifeDate ? new Date(epiData.endOfLifeDate) : undefined
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
  }, [id, isEditMode]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.brand) errors.brand = 'La marque est requise';
    if (!formData.model) errors.model = 'Le modèle est requis';
    if (!formData.serialNumber) errors.serialNumber = 'Le numéro de série est requis';
    if (!formData.periodicity) errors.periodicity = 'La périodicité est requise';
    if (!formData.epiTypeId) errors.epiTypeId = 'Le type d\'EPI est requis';
    if (!formData.statusId) errors.statusId = 'Le statut est requis';
    if (!formData.purchaseDate) errors.purchaseDate = 'La date d\'achat est requise';
    if (!formData.manufactureDate) errors.manufactureDate = 'La date de fabrication est requise';
    if (!formData.serviceStartDate) errors.serviceStartDate = 'La date de mise en service est requise';
    
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
        await updateEPI(parseInt(id), formData as EPI);
      } else {
        await createEPI(formData as EPI);
      }
      
      navigate('/epis');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError('Erreur lors de l\'enregistrement de l\'EPI');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: parseInt(value) || 0 }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: parseInt(value) || 0 }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setFormData(prevData => ({ ...prevData, [name]: date }));
    }
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Modifier l\'EPI' : 'Ajouter un nouvel EPI'}
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Marque"
                  name="brand"
                  value={formData.brand || ''}
                  onChange={handleChange}
                  error={!!formErrors.brand}
                  helperText={formErrors.brand}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Modèle"
                  name="model"
                  value={formData.model || ''}
                  onChange={handleChange}
                  error={!!formErrors.model}
                  helperText={formErrors.model}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Numéro de série"
                  name="serialNumber"
                  value={formData.serialNumber || ''}
                  onChange={handleChange}
                  error={!!formErrors.serialNumber}
                  helperText={formErrors.serialNumber}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Taille"
                  name="size"
                  value={formData.size || ''}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Couleur"
                  name="color"
                  value={formData.color || ''}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.epiTypeId}>
                  <InputLabel>Type d'EPI</InputLabel>
                  <Select
                    name="epiTypeId"
                    value={formData.epiTypeId?.toString() || ''}
                    onChange={handleSelectChange}
                    label="Type d'EPI"
                  >
                    {epiTypes.map(type => (
                      <MenuItem key={type.id} value={type.id?.toString()}>
                        {type.typeName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.epiTypeId && <FormHelperText>{formErrors.epiTypeId}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.statusId}>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    name="statusId"
                    value={formData.statusId?.toString() || ''}
                    onChange={handleSelectChange}
                    label="Statut"
                  >
                    {epiStatuses.map(status => (
                      <MenuItem key={status.id} value={status.id?.toString()}>
                        {status.statusName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.statusId && <FormHelperText>{formErrors.statusId}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Périodicité de vérification (mois)"
                  name="periodicity"
                  value={formData.periodicity || ''}
                  onChange={handleNumberChange}
                  error={!!formErrors.periodicity}
                  helperText={formErrors.periodicity}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date d'achat"
                    value={formData.purchaseDate instanceof Date ? formData.purchaseDate : null}
                    onChange={(date) => handleDateChange('purchaseDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!formErrors.purchaseDate,
                        helperText: formErrors.purchaseDate
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de fabrication"
                    value={formData.manufactureDate instanceof Date ? formData.manufactureDate : null}
                    onChange={(date) => handleDateChange('manufactureDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!formErrors.manufactureDate,
                        helperText: formErrors.manufactureDate
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de mise en service"
                    value={formData.serviceStartDate instanceof Date ? formData.serviceStartDate : null}
                    onChange={(date) => handleDateChange('serviceStartDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!formErrors.serviceStartDate,
                        helperText: formErrors.serviceStartDate
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de fin de vie (optionnelle)"
                    value={formData.endOfLifeDate instanceof Date ? formData.endOfLifeDate : null}
                    onChange={(date) => handleDateChange('endOfLifeDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                </Grid>
              </LocalizationProvider>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/epis')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {isEditMode ? 'Mettre à jour' : 'Créer'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default EPIForm;