// Nouveau fichier à créer : GestEPIFront/src/pages/UserList.tsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { getAllUsers, deleteUser } from '../services/api';
import { User } from '../types';
import { exportUserListToPDF, exportUserListToExcel } from '../services/exportService';

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  if (loading) return <Typography>Chargement en cours...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Liste des Utilisateurs
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<FileDownloadIcon />} 
              onClick={() => exportUserListToPDF(users)}
              sx={{ mr: 1 }}
            >
              Exporter PDF
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<FileDownloadIcon />} 
              onClick={() => exportUserListToExcel(users)}
            >
              Exporter Excel
            </Button>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            component={RouterLink} 
            to="/users/new"
          >
            Ajouter un utilisateur
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="table des utilisateurs">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>{user.typeName}</TableCell>
                  <TableCell>
                    <IconButton 
                      component={RouterLink} 
                      to={`/users/${user.id}`}
                      color="primary" 
                      aria-label="voir"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      component={RouterLink} 
                      to={`/users/edit/${user.id}`}
                      color="primary" 
                      aria-label="modifier"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      aria-label="supprimer"
                      onClick={() => user.id && handleDelete(user.id)}
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

export default UserList;