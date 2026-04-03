import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';

export function AssuranceIndividuellePage() {
  const { user } = useAuth();
  const location = useLocation();
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  useEffect(() => {
    import('mfe2/AccountLinkForm')
      .then((mfe2) => {
        setComponent(() => mfe2.AccountLinkForm);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load MFE2:', err);
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
        Assurance Individuelle
      </Typography>
      {Component && <Component onSubmit={(data) => console.log('Compte:', data)} />}
    </Box>
  );
}