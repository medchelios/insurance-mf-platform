import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, CircularProgress, Alert, Button, Card, CardContent } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
    const loadComponent = async () => {
      try {
        const mfe2 = await import('mfe2/AccountLinkForm');
        setComponent(() => mfe2.AccountLinkForm);
      } catch (err) {
        console.warn('Federation load failed:', err.message);
        setError('Module Federation non disponible - utilisez le bouton ci-dessous');
      } finally {
        setLoading(false);
      }
    };
    loadComponent();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assurance Individuelle
      </Typography>
      
      {error || !Component ? (
        <Card sx={{ mt: 2, bgcolor: '#e8f5e9' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Formulaire Liaison Compte Épargne
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {error || 'Chargement du module Federation...'}
            </Typography>
            <Button 
              variant="contained" 
              color="success"
              startIcon={<OpenInNewIcon />}
              onClick={() => window.open('http://localhost:3002', '_blank')}
            >
              Ouvrir le formulaire (MFE Vue)
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Component onSubmit={(data) => console.log('Compte:', data)} />
      )}
    </Box>
  );
}