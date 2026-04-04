import { useClaims } from '../services/claims';
import { useAccounts } from '../services/accounts';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Grid, Chip, Button, Paper } from '@mui/material';
import { CarCrash, AccountBalance } from '@mui/icons-material';

const claimStatusColors: Record<string, 'success' | 'warning' | 'error'> = {
  nouveau: 'success',
  en_cours: 'warning',
  traite: 'success',
  refuse: 'error',
};

export function Dashboard() {
  const { user } = useAuth();
  const { data: claims } = useClaims();
  const { data: accounts } = useAccounts();

  const totalBalance = accounts?.reduce((sum, acc) => sum + parseFloat(acc.balance), 0) || 0;

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Bienvenue, {user?.name}
        </Typography>
        <Typography color="text.secondary">
          Votre résumé d'assurance
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <CarCrash sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" fontWeight="bold">{claims?.length || 0}</Typography>
            <Typography color="text.secondary" variant="body2">Sinistres</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AccountBalance sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
            <Typography variant="h5" fontWeight="bold">{accounts?.length || 0}</Typography>
            <Typography color="text.secondary" variant="body2">Comptes</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {totalBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </Typography>
            <Typography color="text.secondary" variant="body2">Patrimoine</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Sinistres</Typography>
              <Button size="small" href="/assurance-dommages">Voir</Button>
            </Box>
            {claims?.slice(0, 3).map((claim) => (
              <Box key={claim.id} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
                <Typography variant="body2">
                  #{claim.id} - {claim.type}
                </Typography>
                <Chip size="small" label={claim.status} color={claimStatusColors[claim.status]} />
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Comptes</Typography>
              <Button size="small" href="/assurance-individuelle">Voir</Button>
            </Box>
            {accounts?.slice(0, 3).map((account) => (
              <Box key={account.id} sx={{ py: 1, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">{account.type}</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {parseFloat(account.balance).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}