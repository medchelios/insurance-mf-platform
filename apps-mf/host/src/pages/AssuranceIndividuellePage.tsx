import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
} from '../services/accounts';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccountBalance,
  Link as LinkIcon,
  ShowChart,
  Delete,
  Add,
  TrendingUp,
  Savings,
  Home,
  Flight,
} from '@mui/icons-material';

const accountTypeOptions = [
  { value: 'epargne', label: 'Compte Épargne', icon: <Savings /> },
  { value: 'placement', label: 'Plan de Placement', icon: <TrendingUp /> },
  { value: 'retraite', label: 'Retraite', icon: <Home /> },
  { value: 'courant', label: 'Compte Courant', icon: <AccountBalance /> },
];

const accountStatusColors: Record<string, 'success' | 'warning' | 'error'> = {
  active: 'success',
  inactive: 'warning',
  closed: 'error',
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
      {value === index && children}
    </Box>
  );
}

export function AssuranceIndividuellePage() {
  const { user } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState(0);

  const { data: accounts, isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();

  const [form, setForm] = useState({
    type: '',
    provider: '',
    account_number: '',
    balance: '',
  });

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount.mutateAsync({
        type: form.type,
        provider: form.provider || null,
        account_number: form.account_number || null,
        balance: form.balance ? parseFloat(form.balance) : 0,
      });
      setForm({ type: '', provider: '', account_number: '', balance: '' });
      setTab(1);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      await deleteAccount.mutateAsync(id);
    }
  };

  const isValid = form.type && form.provider;

  const totalBalance = accounts?.reduce((sum, acc) => sum + parseFloat(acc.balance), 0) || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          <AccountBalance sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
          Assurance Individuelle
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestion de vos comptes et patrimoine
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
            <Typography variant="body2" gutterBottom>Patrimoine Total</Typography>
            <Typography variant="h4" fontWeight="bold">
              {totalBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
            <Typography variant="body2" gutterBottom>Nombre de Comptes</Typography>
            <Typography variant="h4" fontWeight="bold">
              {accounts?.length || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
            <Typography variant="body2" gutterBottom>Comptes Actifs</Typography>
            <Typography variant="h4" fontWeight="bold">
              {accounts?.filter((a) => a.status === 'active').length || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Card>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<LinkIcon />} iconPosition="start" label="Lier un compte" />
          <Tab icon={<AccountBalance />} iconPosition="start" label="Mes comptes" />
          <Tab icon={<ShowChart />} iconPosition="start" label="Patrimoine" />
        </Tabs>

        <CardContent>
          <TabPanel value={tab} index={0}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Type de compte</InputLabel>
                    <Select
                      value={form.type}
                      onChange={handleChange('type')}
                      label="Type de compte"
                    >
                      {accountTypeOptions.map((t) => (
                        <MenuItem key={t.value} value={t.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {t.icon}
                            {t.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Prestataire / Banque"
                    value={form.provider}
                    onChange={handleChange('provider')}
                    placeholder="Ex: AXA, BNP Paribas..."
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Numéro de compte"
                    value={form.account_number}
                    onChange={handleChange('account_number')}
                    placeholder="Numéro de compte ou contrat"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Solde actuel (€)"
                    type="number"
                    value={form.balance}
                    onChange={handleChange('balance')}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    size="large"
                    disabled={!isValid || createAccount.isPending}
                    startIcon={createAccount.isPending && <CircularProgress size={20} />}
                  >
                    {createAccount.isPending ? 'Enregistrement...' : 'Lier le compte'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Prestataire</TableCell>
                        <TableCell>Numéro</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell align="right">Solde</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accounts?.map((account) => (
                        <TableRow key={account.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {accountTypeOptions.find((t) => t.value === account.type)?.icon || <AccountBalance />}
                              <Typography variant="body2" fontWeight="500">
                                {accountTypeOptions.find((t) => t.value === account.type)?.label || account.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{account.provider}</TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {account.account_number || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={account.status}
                              color={accountStatusColors[account.status] || 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold" color="primary.main">
                              {parseFloat(account.balance).toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDelete(account.id)}
                              disabled={deleteAccount.isPending}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {accounts?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">
                              Aucun compte lié. Utilisez l'onglet "Lier un compte".
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {accounts && accounts.length > 0 && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>Total du patrimoine:</strong>{' '}
                      <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                        {totalBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </span>
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <Grid container spacing={3}>
              {accounts?.map((account) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={account.id}>
                  <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        {accountTypeOptions.find((t) => t.value === account.type)?.icon || <AccountBalance />}
                        <Typography variant="h6" fontWeight="bold">
                          {accountTypeOptions.find((t) => t.value === account.type)?.label || account.type}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {account.provider}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {parseFloat(account.balance).toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </Typography>
                      <Chip
                        label={account.status}
                        color={accountStatusColors[account.status] || 'default'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {accounts?.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      Aucun compte pour afficher le patrimoine
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}