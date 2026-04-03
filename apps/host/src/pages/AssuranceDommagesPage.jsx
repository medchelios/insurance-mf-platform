import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, Box, Card, CardContent, Tabs, Tab, TextField, Button, Grid, Checkbox, FormControlLabel, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const sinistreTypes = [
  { value: 'degats-eaux', label: 'Dégôts des eaux' },
  { value: 'incendie', label: 'Incendie' },
  { value: 'vol', label: 'Vol' },
  { value: 'accident', label: 'Accident de circulation' },
  { value: 'autre', label: 'Autre' },
];

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export function AssuranceDommagesPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  const [form, setForm] = useState({
    typeSinistre: '',
    dateSinistre: '',
    description: '',
    montantEstime: '',
    dejaDeclare: false,
    numeroContrat: ''
  });

  const [suivi, setSuivi] = useState({
    numeroSinistre: '',
    email: ''
  });

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSuiviChange = (field) => (e) => {
    setSuivi(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Réclamation:', form);
    setSubmitted(true);
  };

  const handleSuiviSubmit = (e) => {
    e.preventDefault();
    console.log('Suivi:', suivi);
    alert(`Suivi du sinistre: ${suivi.numeroSinistre}`);
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
              Nouvelle réclamation
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
        Gestion des sinistres et réclamations
      </Typography>
      
      <Card>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Nouvelle réclamation" />
          <Tab label="Suivi sinistre" />
          <Tab label="Mes réclamations" />
        </Tabs>
        
        <CardContent>
          <TabPanel value={tab} index={0}>
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
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Numéro de sinistre"
                  value={suivi.numeroSinistre}
                  onChange={handleSuiviChange('numeroSinistre')}
                  placeholder="Ex: SIN-2024-001234"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={suivi.email}
                  onChange={handleSuiviChange('email')}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={handleSuiviSubmit}>
                  Rechercher
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <Typography color="text.secondary">
              Aucune réclamation trouvée. Utilisez l'onglet "Nouvelle réclamation" pour en créer une.
            </Typography>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}