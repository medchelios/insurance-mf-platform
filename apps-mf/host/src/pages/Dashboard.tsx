import { useClaims } from '../services/claims';
import { useAccounts } from '../services/accounts';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CarCrash,
  Home,
  AccountBalance,
  TrendingUp,
  AttachMoney,
  Warning,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';

const claimTypeLabels: Record<string, string> = {
  voiture: 'Auto',
  habitation: 'Habitation',
  santé: 'Santé',
};

const claimStatusColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  nouveau: 'success',
  en_cours: 'warning',
  traite: 'success',
  refuse: 'error',
};

const accountTypeLabels: Record<string, string> = {
  epargne: 'Épargne',
  placement: 'Placement',
  retraite: 'Retraite',
  courant: 'Compte Courant',
};

export function Dashboard() {
  const { user } = useAuth();
  const { data: claims, isLoading: claimsLoading } = useClaims();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  const stats = {
    totalClaims: claims?.length || 0,
    pendingClaims: claims?.filter((c) => c.status === 'nouveau' || c.status === 'en_cours').length || 0,
    totalAccounts: accounts?.length || 0,
    totalBalance: accounts?.reduce((sum, acc) => sum + parseFloat(acc.balance), 0) || 0,
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}15`, color }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Bienvenue, {user?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Voici un aperçu de vos assurances et comptes
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Sinistres"
            value={stats.totalClaims}
            icon={<CarCrash />}
            color="#1976d2"
            subtitle={`${stats.pendingClaims} en attente`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Comptes"
            value={stats.totalAccounts}
            icon={<AccountBalance />}
            color="#2e7d32"
            subtitle="Comptes actifs"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Patrimoine Total"
            value={stats.totalBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            icon={<AttachMoney />}
            color="#ed6c02"
            subtitle="Valeur estimée"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="En Attente"
            value={stats.pendingClaims}
            icon={<Warning />}
            color="#d32f2f"
            subtitle="Sinistres à traiter"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                <CarCrash sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sinistres Récents
              </Typography>
              <Button size="small" href="/assurance-dommages">
                Voir tout
              </Button>
            </Box>
            {claimsLoading ? (
              <LinearProgress />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell align="right">Montant</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {claims?.slice(0, 5).map((claim) => (
                      <TableRow key={claim.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {claimTypeLabels[claim.type] || claim.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={claim.status.replace('_', ' ')}
                            color={claimStatusColors[claim.status] || 'default'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {claim.estimated_amount
                            ? `${parseFloat(claim.estimated_amount).toLocaleString('fr-FR')} €`
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {claims?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">Aucun sinistre</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
                Mes Comptes
              </Typography>
              <Button size="small" href="/assurance-individuelle">
                Voir tout
              </Button>
            </Box>
            {accountsLoading ? (
              <LinearProgress />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Prestataire</TableCell>
                      <TableCell align="right">Solde</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accounts?.slice(0, 5).map((account) => (
                      <TableRow key={account.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {accountTypeLabels[account.type] || account.type}
                          </Typography>
                        </TableCell>
                        <TableCell>{account.provider || '-'}</TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold" color="primary">
                            {parseFloat(account.balance).toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {accounts?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">Aucun compte</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}