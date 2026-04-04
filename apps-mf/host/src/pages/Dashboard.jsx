import { Typography, Box } from '@mui/material';

export function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Bienvenue sur le dashboard. Utilisez le menu ci-dessus pour naviguer vers les MFEs.
      </Typography>
    </Box>
  );
}