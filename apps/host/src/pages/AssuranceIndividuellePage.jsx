import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, Card, CardContent, TextField, Button, Grid, Checkbox, FormControlLabel, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const accountTypes = [
  { value: 'epargne', label: 'Compte épargne' },
  { value: 'placement', label: 'Plan de placement' },
  { value: 'assurance-vie', label: 'Assurance vie' },
  { value: 'perp', label: 'PERP' },
  { value: 'pel', label: 'Plan épargne logement' },
];

export function AssuranceIndividuellePage() {
  const { user } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({
    accountType: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    balance: '',
    autoUpdate: false,
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Compte lié:', form);
    setSubmitted(true);
  };

  const isValid = form.accountType && form.bankName && form.accountNumber && form.accountHolder;

  if (submitted) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Assurance Individuelle</Typography>
        <Card sx={{ mt: 2, bgcolor: '#e8f5e9' }}>
          <CardContent>
            <Typography variant="h6" color="primary">Compte lié avec succès!</Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setSubmitted(false)}>
              Lier un autre compte
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Assurance Individuelle</Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Formulaire de liaison au compte d'épargne et placement
      </Typography>
      
      <Card sx={{ mt: 2 }}>
        <CardContent>
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
                  placeholder="Ex: BNP Paribas"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Numéro de compte"
                  value={form.accountNumber}
                  onChange={handleChange('accountNumber')}
                  placeholder="Ex: FR76 XXXX..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Titulaire du compte"
                  value={form.accountHolder}
                  onChange={handleChange('accountHolder')}
                  placeholder="Nom et prénom"
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
                  label="Notes supplémentaires"
                  multiline
                  rows={3}
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
        </CardContent>
      </Card>
    </Box>
  );
}