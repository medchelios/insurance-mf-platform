import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Module Federation Concept
          </Typography>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/assurance-dommages">
                Assurance Dommages
              </Button>
              <Button color="inherit" component={Link} to="/assurance-individuelle">
                Assurance Individuelle
              </Button>
              <Typography variant="body2" sx={{ mx: 2 }}>
                {user.name}
              </Typography>
              <Button color="inherit" onClick={logout}>
                Déconnexion
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}