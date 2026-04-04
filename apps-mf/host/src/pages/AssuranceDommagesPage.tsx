import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClaims, useCreateClaim, useDeleteClaim } from '../services/claims';
import { Box, Typography, Card, Tabs, Tab, TextField, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add, Search, Delete } from '@mui/icons-material';

const claimTypes = [
  { value: 'voiture', label: 'Voiture' },
  { value: 'habitation', label: 'Habitation' },
  { value: 'sante', label: 'Santé' },
];

const claimStatusColors: Record<string, 'success' | 'warning' | 'error'> = {
  nouveau: 'success',
  en_cours: 'warning',
  traite: 'success',
  refuse: 'error',
};

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return <Box hidden={value !== index} sx={{ pt: 3 }}>{value === index && children}</Box>;
}

export function AssuranceDommagesPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState(0);
  const [searchId, setSearchId] = useState('');

  const { data: claims, isLoading } = useClaims();
  const createClaim = useCreateClaim();
  const deleteClaim = useDeleteClaim();

  const [form, setForm] = useState({ type: '', description: '', incident_date: '', estimated_amount: '' });

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createClaim.mutateAsync({
      type: form.type,
      description: form.description,
      incident_date: form.incident_date || null,
      estimated_amount: form.estimated_amount ? parseFloat(form.estimated_amount) : null,
    });
    setForm({ type: '', description: '', incident_date: '', estimated_amount: '' });
    setTab(2);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer ce sinistre ?')) {
      await deleteClaim.mutateAsync(id);
    }
  };

  const searchedClaim = claims?.find(c => c.id === parseInt(searchId));

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ textAlign: 'center', mb: 1 }}>
        Sinistres
      </Typography>
      <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
        Gérez vos réclamations
      </Typography>

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="Nouveau" icon={<Add />} />
          <Tab label="Suivi" icon={<Search />} />
          <Tab label="Mes sinistres" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tab} index={0}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} label="Type">
                      {claimTypes.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Date" type="date" value={form.incident_date} onChange={(e) => setForm({ ...form, incident_date: e.target.value })} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Montant (€)" type="number" value={form.estimated_amount} onChange={(e) => setForm({ ...form, estimated_amount: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained" disabled={!form.type || !form.description} startIcon={createClaim.isPending && <CircularProgress size={16} />}>
                    Soumettre
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Box sx={{ textAlign: 'center' }}>
              <TextField label="N° sinistre" value={searchId} onChange={(e) => setSearchId(e.target.value)} sx={{ mb: 2 }} />
              {searchedClaim && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography>#{searchedClaim.id} - {claimTypes.find(t => t.value === searchedClaim.type)?.label}</Typography>
                  <Chip label={searchedClaim.status} color={claimStatusColors[searchedClaim.status]} size="small" sx={{ mt: 1 }} />
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            {isLoading ? <CircularProgress /> : (
              <TableContainer>
                <Table>
                  <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Type</TableCell><TableCell>Statut</TableCell><TableCell>Montant</TableCell><TableCell></TableCell></TableRow></TableHead>
                  <TableBody>
                    {claims?.map(c => (
                      <TableRow key={c.id}>
                        <TableCell>#{c.id}</TableCell>
                        <TableCell>{claimTypes.find(t => t.value === c.type)?.label || c.type}</TableCell>
                        <TableCell><Chip label={c.status} color={claimStatusColors[c.status]} size="small" /></TableCell>
                        <TableCell>{c.estimated_amount ? parseFloat(c.estimated_amount) + ' €' : '-'}</TableCell>
                        <TableCell><IconButton size="small" color="error" onClick={() => handleDelete(c.id)} disabled={deleteClaim.isPending}><Delete /></IconButton></TableCell>
                      </TableRow>
                    ))}
                    {claims?.length === 0 && <TableRow><TableCell colSpan={5} align="center">Aucun sinistre</TableCell></TableRow>}
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