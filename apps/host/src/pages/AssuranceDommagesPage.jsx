import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, Card, CardContent, TextField, Button, Grid, Checkbox, FormControlLabel, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const sinistreTypes = [
  { value: 'degats-eaux', label: 'Dégôts des eaux' },
  { value: 'incendie', label: 'Incendie' },
  { value: 'vol', label: 'Vol' },
  { value: 'accident', label: 'Accident de circulation' },
  { value: 'autre', label: 'Autre' },
];

export function AssuranceDommagesPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({
    typeSinistre: '',
    dateSinistre: '',
    description: '',
    montantEstime: '',
    dejaDeclare: false,
    numeroContrat: ''
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
    console.log('Réclamation soumise:', form);
    setSubmitted(true);
  };

  const isValid = form.typeSinistre && form.dateSinistre && form.description && form.numeroContrat;

  if (submitted) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Assurance Dommages</Typography>
        <Card sx={{ mt: 2, bgcolor: '#e8f5e9' }}>
          <CardContent>
            <Typography variant="h6" color="primary">Réclamation soumise avec succès!</Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setSubmitted(false)}>
              Soumettre une autre réclamation
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Assurance Dommages</Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Formulaire de réclamation pour dommages assurance
      </Typography>
      
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type de sinistre</InputLabel>
                  <Select
                    value={form.typeSinistre}
                    onChange={handleChange('typeSinistre')}
                    label="Type de sinistre"
                  >
                    {sinistreTypes.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date du sinistre"
                  type="date"
                  value={form.dateSinistre}
                  onChange={handleChange('dateSinistre')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description détaillée"
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Décrivez les circonstances du sinistre..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Montant estimé (€)"
                  type="number"
                  value={form.montantEstime}
                  onChange={handleChange('montantEstime')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Numéro de contrat"
                  value={form.numeroContrat}
                  onChange={handleChange('numeroContrat')}
                  placeholder="Ex: POL-2024-XXXXX"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={form.dejaDeclare} onChange={handleChange('dejaDeclare')} />}
                  label="Déclaration déjà effectuée auprès de l'assureur"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" disabled={!isValid}>
                  Soumettre la réclamation
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}