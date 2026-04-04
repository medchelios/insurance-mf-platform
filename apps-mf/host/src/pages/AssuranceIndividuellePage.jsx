import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, Card, CardContent, Tabs, Tab, TextField, Button, Grid, Checkbox, FormControlLabel, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const accountTypes = [
  { value: 'epargne', label: 'Compte épargne' },
  { value: 'placement', label: 'Plan de placement' },
  { value: 'assurance-vie', label: 'Assurance vie' },
  { value: 'perp', label: 'PERP' },
  { value: 'pel', label: 'Plan épargne logement' },
];

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export function AssuranceIndividuellePage() {
  const { user } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [accounts, setAccounts] = useState([
    { id: 1, type: 'assurance-vie', bankName: 'AXA', accountNumber: 'FR761234', accountHolder: 'Dupont Jean', balance: 15000, autoUpdate: true },
    { id: 2, type: 'epargne', bankName: 'LCL', accountNumber: 'FR765678', accountHolder: 'Dupont Jean', balance: 5000, autoUpdate: false },
  ]);

  const [form, setForm] = useState({
    accountType: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    balance: '',
    autoUpdate: false,
    notes: ''
  });

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAccount = {
      id: Date.now(),
      ...form,
      balance: parseFloat(form.balance) || 0
    };
    setAccounts(prev => [...prev, newAccount]);
    setSubmitted(true);
    setForm({
      accountType: '',
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      balance: '',
      autoUpdate: false,
      notes: ''
    });
  };

  const handleDelete = (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const isValid = form.accountType && form.bankName && form.accountNumber && form.accountHolder;

  const getAccountTypeLabel = (type) => accountTypes.find(t => t.value === type)?.label || type;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Assurance Individuelle</Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Gestion des comptes d'épargne et placement
      </Typography>
      
      <Card>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Lier un compte" />
          <Tab label="Mes comptes" />
          <Tab label="Évolution patrimoine" />
        </Tabs>
        
        <CardContent>
          <TabPanel value={tab} index={0}>
            {submitted ? (
              <Card sx={{ bgcolor: '#e8f5e9' }}>
                <CardContent>
                  <Typography variant="h6" color="primary">Compte lié avec succès!</Typography>
                  <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setSubmitted(false)}>
                    Lier un autre compte
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Type de compte</InputLabel>
                      <Select
                        value={form.accountType}
                        onChange={handleChange('accountType')}
                        label="Type de compte"
                      >
                        {accountTypes.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nom de la banque"
                      value={form.bankName}
                      onChange={handleChange('bankName')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Numéro de compte"
                      value={form.accountNumber}
                      onChange={handleChange('accountNumber')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Titulaire du compte"
                      value={form.accountHolder}
                      onChange={handleChange('accountHolder')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Solde actuel (€)"
                      type="number"
                      value={form.balance}
                      onChange={handleChange('balance')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox checked={form.autoUpdate} onChange={handleChange('autoUpdate')} />}
                      label="Mise à jour automatique du solde"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      multiline
                      rows={2}
                      value={form.notes}
                      onChange={handleChange('notes')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="success" disabled={!isValid}>
                      Lier le compte
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Banque</TableCell>
                    <TableCell>Numéro</TableCell>
                    <TableCell>Titulaire</TableCell>
                    <TableCell align="right">Solde</TableCell>
                    <TableCell>Auto-update</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Aucun compte lié. Utilisez l'onglet "Lier un compte".
                      </TableCell>
                    </TableRow>
                  ) : (
                    accounts.map(account => (
                      <TableRow key={account.id}>
                        <TableCell>{getAccountTypeLabel(account.type)}</TableCell>
                        <TableCell>{account.bankName}</TableCell>
                        <TableCell>{account.accountNumber}</TableCell>
                        <TableCell>{account.accountHolder}</TableCell>
                        <TableCell align="right">{account.balance.toLocaleString()} €</TableCell>
                        <TableCell>
                          {account.autoUpdate && <Chip label="Auto" size="small" color="success" />}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small"><EditIcon /></IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(account.id)}><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {accounts.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Total:</strong> {accounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()} €
                </Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>Évolution du patrimoine</Typography>
              <Typography color="text.secondary">
                Graphique d'évolution des comptes d'épargne et placement.
              </Typography>
              <Box sx={{ mt: 3, height: 200, bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Graphique à venir (intégration API)</Typography>
              </Box>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}