import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccounts, useCreateAccount, useDeleteAccount } from '../services/accounts';
import { Box, Typography, Card, Tabs, Tab, TextField, Button, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
import { Link as LinkIcon, AccountBalance, Delete } from '@mui/icons-material';

const accountTypes = [
  { value: 'epargne', label: 'Épargne' },
  { value: 'placement', label: 'Placement' },
  { value: 'retraite', label: 'Retraite' },
  { value: 'courant', label: 'Courant' },
];

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return <Box hidden={value !== index} sx={{ pt: 3 }}>{value === index && children}</Box>;
}

export function AssuranceIndividuellePage() {
  const { user } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState(0);

  const { data: accounts, isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();

  const [form, setForm] = useState({ type: '', provider: '', account_number: '', balance: '' });

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAccount.mutateAsync({
      type: form.type,
      provider: form.provider || null,
      account_number: form.account_number || null,
      balance: form.balance ? parseFloat(form.balance) : 0,
    });
    setForm({ type: '', provider: '', account_number: '', balance: '' });
    setTab(1);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer ce compte ?')) {
      await deleteAccount.mutateAsync(id);
    }
  };

  const total = accounts?.reduce((sum, acc) => sum + parseFloat(acc.balance), 0) || 0;

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ textAlign: 'center', mb: 1 }}>
        Comptes
      </Typography>
      <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
        Gérez vos comptes et patrimoine
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">{accounts?.length || 0}</Typography>
            <Typography variant="body2" color="text.secondary">Comptes</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </Typography>
            <Typography variant="body2" color="text.secondary">Total</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="Lier" icon={<LinkIcon />} />
          <Tab label="Mes comptes" icon={<AccountBalance />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tab} index={0}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} label="Type">
                      {accountTypes.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Prestataire" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Numéro" value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Solde (€)" type="number" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained" color="success" disabled={!form.type || !form.provider} startIcon={createAccount.isPending && <CircularProgress size={16} />}>
                    Ajouter
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            {isLoading ? <CircularProgress /> : (
              <TableContainer>
                <Table>
                  <TableHead><TableRow><TableCell>Type</TableCell><TableCell>Prestataire</TableCell><TableCell>Solde</TableCell><TableCell></TableCell></TableRow></TableHead>
                  <TableBody>
                    {accounts?.map(a => (
                      <TableRow key={a.id}>
                        <TableCell>{accountTypes.find(t => t.value === a.type)?.label || a.type}</TableCell>
                        <TableCell>{a.provider}</TableCell>
                        <TableCell fontWeight="bold">{parseFloat(a.balance).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                        <TableCell><IconButton size="small" color="error" onClick={() => handleDelete(a.id)} disabled={deleteAccount.isPending}><Delete /></IconButton></TableCell>
                      </TableRow>
                    ))}
                    {accounts?.length === 0 && <TableRow><TableCell colSpan={4} align="center">Aucun compte</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </Box>
      </Card>
    </Box>
  );
}