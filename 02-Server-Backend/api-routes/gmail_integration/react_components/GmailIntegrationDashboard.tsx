/**
 * Gmail Integration Dashboard Component for VITAL RED
 * Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar
} from '@mui/material';
import {
  Email as EmailIcon,
  LocalHospital as HospitalIcon,
  Assignment as ReferralIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Types
interface EmailData {
  id: number;
  gmail_id: string;
  subject: string;
  sender_email: string;
  sender_name: string;
  date_received: string;
  is_medical_referral: boolean;
  priority_level: string;
  processing_status: string;
}

interface ReferralData {
  id: number;
  referral_number: string;
  referral_type: string;
  specialty_requested: string;
  priority_level: string;
  status: string;
  referral_date: string;
  primary_diagnosis: string;
  referring_hospital: string;
  referring_physician: string;
}

interface SystemStats {
  emails: {
    total: number;
    pending: number;
    medical_referrals: number;
  };
  referrals: {
    total: number;
    pending: number;
  };
  service: {
    is_running: boolean;
    processed_count: number;
    error_count: number;
  };
}

interface WebSocketMessage {
  type: string;
  timestamp: string;
  data?: any;
}

// Custom hooks
const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
      
      // Join dashboard room
      ws.send(JSON.stringify({
        type: 'join_room',
        room: 'dashboard'
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setLastMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, isConnected]);

  return { isConnected, lastMessage, sendMessage };
};

const useGmailAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(async (endpoint: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/gmail-integration${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { apiCall, loading, error };
};

// Priority color mapping
const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'alta':
    case 'critico':
      return 'error';
    case 'media':
      return 'warning';
    case 'baja':
      return 'info';
    default:
      return 'default';
  }
};

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'assigned':
      return 'success';
    case 'pending':
    case 'in_review':
      return 'warning';
    case 'error':
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

// Main Dashboard Component
const GmailIntegrationDashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [recentEmails, setRecentEmails] = useState<EmailData[]>([]);
  const [recentReferrals, setRecentReferrals] = useState<ReferralData[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<ReferralData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { apiCall, loading, error } = useGmailAPI();
  const { isConnected, lastMessage, sendMessage } = useWebSocket('ws://localhost:8002');

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      handleWebSocketMessage(lastMessage);
    }
  }, [lastMessage]);

  const loadDashboardData = async () => {
    try {
      const [statsData, emailsData, referralsData] = await Promise.all([
        apiCall('/statistics'),
        apiCall('/emails?limit=10&is_referral=true'),
        apiCall('/referrals?limit=10&status=pending')
      ]);

      setStats(statsData);
      setRecentEmails(emailsData);
      setRecentReferrals(referralsData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'new_email':
        if (message.data?.is_medical_referral) {
          setRecentEmails(prev => [message.data, ...prev.slice(0, 9)]);
          showSnackbar('Nueva referencia médica recibida');
        }
        break;
      
      case 'new_referral':
        setRecentReferrals(prev => [message.data, ...prev.slice(0, 9)]);
        showSnackbar('Nueva referencia creada');
        break;
      
      case 'referral_updated':
        setRecentReferrals(prev => 
          prev.map(ref => 
            ref.id === message.data.id 
              ? { ...ref, status: message.data.new_status }
              : ref
          )
        );
        showSnackbar('Referencia actualizada');
        break;
      
      case 'system_alert':
        if (message.data.level === 'CRITICAL') {
          showSnackbar(`Alerta crítica: ${message.data.title}`, 'error');
        }
        break;
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await apiCall('/service/sync', { method: 'POST' });
      await loadDashboardData();
      showSnackbar('Sincronización completada', 'success');
    } catch (err) {
      showSnackbar('Error en la sincronización', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleReferralEdit = (referral: ReferralData) => {
    setSelectedReferral(referral);
    setEditDialogOpen(true);
  };

  const handleReferralUpdate = async (updatedData: Partial<ReferralData>) => {
    if (!selectedReferral) return;

    try {
      await apiCall(`/referrals/${selectedReferral.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });
      
      setEditDialogOpen(false);
      showSnackbar('Referencia actualizada exitosamente', 'success');
      await loadDashboardData();
    } catch (err) {
      showSnackbar('Error actualizando referencia', 'error');
    }
  };

  if (loading && !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Integración Gmail - VITAL RED
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            icon={isConnected ? <CheckIcon /> : <ErrorIcon />}
            label={isConnected ? 'Conectado' : 'Desconectado'}
            color={isConnected ? 'success' : 'error'}
            variant="outlined"
          />
          
          <Button
            variant="contained"
            startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Sincronizar
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <EmailIcon color="primary" />
                <Box>
                  <Typography variant="h6">{stats?.emails.total || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Emails
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <HospitalIcon color="secondary" />
                <Box>
                  <Typography variant="h6">{stats?.emails.medical_referrals || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Referencias Médicas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ReferralIcon color="warning" />
                <Box>
                  <Typography variant="h6">{stats?.referrals.pending || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <WarningIcon color="error" />
                <Box>
                  <Typography variant="h6">{stats?.service.error_count || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Errores
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Emails and Referrals */}
      <Grid container spacing={3}>
        {/* Recent Medical Referral Emails */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Emails Recientes
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Asunto</TableCell>
                      <TableCell>Remitente</TableCell>
                      <TableCell>Prioridad</TableCell>
                      <TableCell>Fecha</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentEmails.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {email.subject}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {email.sender_name || email.sender_email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={email.priority_level || 'Media'}
                            color={getPriorityColor(email.priority_level)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDistanceToNow(new Date(email.date_received), {
                              addSuffix: true,
                              locale: es
                            })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Referrals */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Referencias Pendientes
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Número</TableCell>
                      <TableCell>Especialidad</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentReferrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <Typography variant="body2">
                            {referral.referral_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {referral.specialty_requested}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={referral.status}
                            color={getStatusColor(referral.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleReferralEdit(referral)}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Referral Dialog */}
      <ReferralEditDialog
        open={editDialogOpen}
        referral={selectedReferral}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleReferralUpdate}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

// Referral Edit Dialog Component
interface ReferralEditDialogProps {
  open: boolean;
  referral: ReferralData | null;
  onClose: () => void;
  onSave: (data: Partial<ReferralData>) => void;
}

const ReferralEditDialog: React.FC<ReferralEditDialogProps> = ({
  open,
  referral,
  onClose,
  onSave
}) => {
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (referral) {
      setStatus(referral.status);
      setNotes('');
    }
  }, [referral]);

  const handleSave = () => {
    onSave({
      status,
      notes: notes || undefined
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Editar Referencia: {referral?.referral_number}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Estado"
            >
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="in_review">En Revisión</MenuItem>
              <MenuItem value="assigned">Asignado</MenuItem>
              <MenuItem value="completed">Completado</MenuItem>
              <MenuItem value="cancelled">Cancelado</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Notas"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Agregar notas sobre la actualización..."
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GmailIntegrationDashboard;
