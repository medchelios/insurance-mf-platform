import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, CircularProgress } from '@mui/material';

export function MFE1Page() {
  const { user } = useAuth();
  const location = useLocation();
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  useEffect(() => {
    Promise.all([
      import('mfe1/ReclamationForm')
    ])
      .then(([mfe1]) => {
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
      <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          MFE1 - Angular
        </Typography>
        <Typography color="error">
          Erreur de chargement: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        MFE1 - Formulaire Réclamation Assurance
      </Typography>
      {Component && <Component onSubmitClaim={(data) => console.log('Claim:', data)} />}
    </Box>
  );
}