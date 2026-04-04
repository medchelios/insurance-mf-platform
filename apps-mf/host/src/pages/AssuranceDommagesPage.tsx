import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  useClaims,
  useCreateClaim,
  useDeleteClaim,
} from '../services/claims';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Delete, Add, Search, CarCrash, Warning, CheckCircle } from '@mui/icons-material';

const claimTypeOptions = [
  { value: 'voiture', label: 'Voiture' },
  { value: 'habitation', label: 'Habitation' },
  { value: 'sante', label: 'Santé' },
];

const claimStatusColors: Record<string, 'success' | 'warning' | 'error' | 'default' | 'info'> = {
  nouveau: 'success',
  en_cours: 'warning',
  traite: 'info',
  refuse: 'error',
};

const claimStatusLabels: Record<string, string> = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  traite: 'Traité',
  refuse: 'Refusé',
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

export function AssuranceDommagesPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [searchedClaim, setSearchedClaim] = useState<any>(null);
  const [searchError, setSearchError] = useState('');

  const { data: claims, isLoading } = useClaims();
  const createClaim = useCreateClaim();
  const deleteClaim = useDeleteClaim();

  const [form, setForm] = useState({
    type: '',
    description: '',
    incident_date: '',
    estimated_amount: '',
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
      await createClaim.mutateAsync({
        type: form.type,
        description: form.description,
        incident_date: form.incident_date || null,
        estimated_amount: form.estimated_amount ? parseFloat(form.estimated_amount) : null,
      });
      setForm({ type: '', description: '', incident_date: '', estimated_amount: '' });
      setTab(2);
    } catch (error) {
      console.error('Error creating claim:', error);
    }
  };

  const handleSearch = async () => {
    const id = parseInt(searchId);
    const claim = claims?.find((c) => c.id === id);
    if (claim) {
      setSearchedClaim(claim);
      setSearchError('');
    } else {
      setSearchedClaim(null);
      setSearchError('Sinistre non trouvé');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sinistre ?')) {
      await deleteClaim.mutateAsync(id);
    }
  };

  const isValid = form.type && form.description;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          <CarCrash sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
          Assurance Dommages
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestion de vos sinistres et réclamations
        </Typography>
      </Box>

      <Card>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<Add />} iconPosition="start" label="Nouvelle réclamation" />
          <Tab icon={<Search />} iconPosition="start" label="Suivi sinistre" />
          <Tab icon={<Warning />} iconPosition="start" label="Mes réclamations" />
        </Tabs>

        <CardContent>
          <TabPanel value={tab} index={0}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Type de sinistre</InputLabel>
                    <Select
                      value={form.type}
                      onChange={handleChange('type')}
                      label="Type de sinistre"
                    >
                      {claimTypeOptions.map((t) => (
                        <MenuItem key={t.value} value={t.value}>
                          {t.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Date du sinistre"
                    type="date"
                    value={form.incident_date}
                    onChange={handleChange('incident_date')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Montant estimé (€)"
                    type="number"
                    value={form.estimated_amount}
                    onChange={handleChange('estimated_amount')}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!isValid || createClaim.isPending}
                    startIcon={createClaim.isPending && <CircularProgress size={20} />}
                  >
                    {createClaim.isPending ? 'Envoi...' : 'Soumettre la réclamation'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Numéro de sinistre"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Entrez l'ID du sinistre"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Button variant="contained" onClick={handleSearch}>
                  Rechercher
                </Button>
              </Grid>
              {searchError && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="error">{searchError}</Alert>
                </Grid>
              )}
              {searchedClaim && (
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Sinistre #{searchedClaim.id}
                    </Typography>
                    <Typography variant="h6">
                      {claimTypeOptions.find((t) => t.value === searchedClaim.type)?.label || searchedClaim.type}
                    </Typography>
                    <Chip
                      label={claimStatusLabels[searchedClaim.status] || searchedClaim.status}
                      color={claimStatusColors[searchedClaim.status] || 'default'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                    {searchedClaim.description && (
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        {searchedClaim.description}
                      </Typography>
                    )}
                    {searchedClaim.estimated_amount && (
                      <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                        Montant estimé: {parseFloat(searchedClaim.estimated_amount).toLocaleString('fr-FR')} €
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            {isLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Montant</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {claims?.map((claim) => (
                      <TableRow key={claim.id} hover>
                        <TableCell>#{claim.id}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {claimTypeOptions.find((t) => t.value === claim.type)?.label || claim.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {claim.description || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {claim.incident_date
                            ? new Date(claim.incident_date).toLocaleDateString('fr-FR')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {claim.estimated_amount
                            ? `${parseFloat(claim.estimated_amount).toLocaleString('fr-FR')} €`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={claimStatusLabels[claim.status] || claim.status}
                            color={claimStatusColors[claim.status] || 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(claim.id)}
                            disabled={deleteClaim.isPending}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {claims?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            Aucune réclamation trouvée
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}