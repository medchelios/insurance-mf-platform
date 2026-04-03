import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';

export function AssuranceDommagesPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  useEffect(() => {
    import('mfe1/ReclamationForm')
      .then((mfe1) => {
        setComponent(() => mfe1.ReclamationFormComponent);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load MFE1:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Erreur de chargement du module: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assurance Dommages
      </Typography>
      {Component && <Component onSubmitClaim={(data) => console.log('Réclamation:', data)} />}
    </Box>
  );
}