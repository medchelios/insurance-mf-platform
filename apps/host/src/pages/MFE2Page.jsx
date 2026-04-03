import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, CircularProgress } from '@mui/material';

export function MFE2Page() {
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
      import('mfe2/AccountLinkForm')
    ])
      .then(([mfe2]) => {
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
      <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          MFE2 - Vue
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
        MFE2 - Liaison Compte Épargne et Placement
      </Typography>
      {Component && <Component onSubmit={(data) => console.log('Account:', data)} />}
    </Box>
  );
}