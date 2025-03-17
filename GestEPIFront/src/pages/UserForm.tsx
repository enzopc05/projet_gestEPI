// GestEPIFront/src/pages/UserForm.tsx
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
import { createUser, getUserById, updateUser } from '../services/api';
import { User } from '../types';

interface UserType {
  id: number;
  typeName: string;
}

const UserForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userTypeId: 0
  });

  const [userTypes, setUserTypes] = useState<UserType[]>([
    { id: 1, typeName: 'Administrateur' },
    { id: 2, typeName: 'Vérificateur' },
    { id: 3, typeName: 'Utilisateur' }
  ]);
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUser = async () => {
      if (isEditMode && id) {
        try {
          const userData = await getUserById(parseInt(id));
          setFormData(userData);
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors du chargement de l\'utilisateur:', err);
          setError('Erreur lors du chargement de l\'utilisateur');
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [id, isEditMode]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName) errors.firstName = 'Le prénom est requis';
    if (!formData.lastName) errors.lastName = 'Le nom est requis';
    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'L\'email n\'est pas valide';
    }
    if (!formData.userTypeId) errors.userTypeId = 'Le rôle est requis';
    
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
        await updateUser(parseInt(id), formData as User);
      } else {
        await createUser(formData as User);
      }
      
      navigate('/users');
    } catch (err: any) {  // Ajouter le type any ici
      console.error('Erreur lors de l\'enregistrement:', err);
      console.log('Détails de l\'erreur:', err.response?.data || err.message);
      console.log('Données envoyées:', formData);
      setError('Erreur lors de l\'enregistrement de l\'utilisateur: ' + (err.response?.data?.message || err.message));
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

  if (loading) return <Typography>Chargement en cours...</Typography>;
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        </Typography>
        
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Prénom"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nom"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required error={!!formErrors.userTypeId}>
                  <InputLabel>Rôle</InputLabel>
                  <Select
                    name="userTypeId"
                    value={formData.userTypeId?.toString() || ''}
                    onChange={handleSelectChange}
                    label="Rôle"
                  >
                    {userTypes.map(type => (
                      <MenuItem key={type.id} value={type.id?.toString()}>
                        {type.typeName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.userTypeId && <FormHelperText>{formErrors.userTypeId}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/users')}
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

export default UserForm;