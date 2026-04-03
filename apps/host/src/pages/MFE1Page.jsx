import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, Box } from '@mui/material';

export function MFE1Page() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        MFE1 - Angular
      </Typography>
      <Typography color="text.secondary">
        Loading Angular component...
      </Typography>
    </Box>
  );
}