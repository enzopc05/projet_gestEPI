import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GestEPI
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Accueil
          </Button>
          <Button color="inherit" component={RouterLink} to="/epis">
            Liste des EPIs
          </Button>
          <Button color="inherit" component={RouterLink} to="/epis/new">
            Nouvel EPI
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;