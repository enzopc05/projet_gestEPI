// À remplacer dans GestEPIFront/src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from '@mui/material';
import { getDashboardStats, getEPIsDueForCheck } from '../services/api';
import { Link as RouterLink } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EPI } from '../types';
import { exportDashboardStatsToPDF } from '../services/exportService';

// Définition des interfaces pour les données du tableau de bord
interface ChartDataPoint {
  name: string;
  value: number;
}

interface HistoryDataPoint {
  month: string;
  count: number;
}

interface DashboardStats {
  epiCount: number;
  epiByType: Array<{ typeName: string; count: number }>;
  epiByStatus: Array<{ statusName: string; count: number }>;
  pendingChecks: {
    count: number;
    urgent: number;
    soon: number;
    upcoming: number;
  };
  checksHistory: Array<{ month: string; count: number }>;
}

// Palette de couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#48C9B0'];
const STATUS_COLORS: Record<string, string> = {
  'Opérationnel': '#4CAF50',
  'À réparer': '#FF9800',
  'Mis au rebut': '#F44336'
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dueEPIs, setDueEPIs] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, dueData] = await Promise.all([
          getDashboardStats(),
          getEPIsDueForCheck()
        ]);
        setStats(statsData);
        setDueEPIs(dueData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données du tableau de bord');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress />
    </Box>
  );
  
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!stats) return <Alert severity="info">Aucune donnée disponible</Alert>;

  // Formatage des données pour les graphiques
  const typeData: ChartDataPoint[] = stats.epiByType.map((item) => ({
    name: item.typeName,
    value: item.count
  }));

  const statusData: ChartDataPoint[] = stats.epiByStatus.map((item) => ({
    name: item.statusName,
    value: item.count
  }));

  // Formater les données de l'historique des vérifications
  const checksHistoryData: HistoryDataPoint[] = stats.checksHistory.map((item) => {
    const [year, month] = item.month.split('-');
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return {
      month: `${monthNames[parseInt(month) - 1]} ${year}`,
      count: item.count
    };
  });

  // Calcul du pourcentage d'EPIs opérationnels
  const operationalPercentage = stats.epiCount > 0 
    ? Math.round((stats.epiByStatus.find((s) => s.statusName === 'Opérationnel')?.count || 0) / stats.epiCount * 100) 
    : 0;

  const urgentChecksCount = stats.pendingChecks.urgent;
  const soonChecksCount = stats.pendingChecks.soon;
  const upcomingChecksCount = stats.pendingChecks.upcoming;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Tableau de bord
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => exportDashboardStatsToPDF(stats)}
          >
            Exporter rapport
          </Button>
        </Box>
        
        {/* Résumé des statistiques */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {stats.epiCount}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Équipements
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {operationalPercentage}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Opérationnels
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Typography variant="h3" color="error" sx={{ fontWeight: 'bold' }}>
                {urgentChecksCount}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vérifications urgentes
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {soonChecksCount + upcomingChecksCount}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Vérifications à venir
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Graphiques */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Répartition par type" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} EPIs`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Répartition par statut" />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry) => (
                        <Cell 
                          key={`cell-${entry.name}`} 
                          fill={STATUS_COLORS[entry.name] || '#8884d8'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} EPIs`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardHeader title="Historique des vérifications" />
              <Divider />
              <CardContent sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={checksHistoryData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <XAxis 
                      dataKey="month" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis name="Nombre de vérifications" />
                    <Tooltip formatter={(value: number) => [`${value} vérifications`, '']} />
                    <Bar dataKey="count" fill="#8884d8" name="Vérifications" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader 
                title="Vérifications à effectuer" 
                action={
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    component={RouterLink} 
                    to="/checks?tab=1"
                    sx={{ 
                      textDecoration: 'none', 
                      cursor: 'pointer',
                      mr: 2
                    }}
                  >
                    Voir tout
                  </Typography>
                }
              />
              <Divider />
              <CardContent sx={{ height: 350, overflow: 'auto' }}>
                {dueEPIs.length === 0 ? (
                  <Alert severity="success">Aucune vérification à effectuer prochainement.</Alert>
                ) : (
                  <List>
                    {dueEPIs.slice(0, 5).map((epi) => (
                      <ListItem 
                        key={epi.id}
                        component={RouterLink}
                        to={`/checks/new?epiId=${epi.id}`}
                        sx={{ 
                          textDecoration: 'none', 
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          }
                        }}
                      >
                        <ListItemIcon>
                          {(epi.daysUntilNextCheck || 0) <= 0 ? (
                            <ErrorIcon color="error" />
                          ) : (epi.daysUntilNextCheck || 0) <= 7 ? (
                            <WarningIcon color="warning" />
                          ) : (
                            <CheckCircleIcon color="info" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${epi.brand} ${epi.model} (${epi.serialNumber})`}
                          secondary={
                            (epi.daysUntilNextCheck || 0) <= 0 
                              ? `En retard de ${Math.abs(epi.daysUntilNextCheck || 0)} jours` 
                              : `Dans ${epi.daysUntilNextCheck} jours`
                          }
                        />
                      </ListItem>
                    ))}
                    {dueEPIs.length > 5 && (
                      <ListItem>
                        <ListItemText 
                          primary={`+ ${dueEPIs.length - 5} autres équipements à vérifier`}
                          primaryTypographyProps={{ 
                            variant: 'body2', 
                            color: 'text.secondary',
                            align: 'center'
                          }}
                        />
                      </ListItem>
                    )}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;