// Nouveau fichier à créer : GestEPIFront/src/pages/UserForm.tsx
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
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement:', err);
      setError('Erreur lors de l\'enregistrement de l\'utilisateur');
    }