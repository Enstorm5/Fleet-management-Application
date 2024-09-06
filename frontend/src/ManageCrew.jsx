import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const ManageCrew = ({ open, onClose, onCrewChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    ship_id: '',
  });
  const [crews, setCrews] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchCrews();
    }
  }, [open]);

  const fetchCrews = async (name = '') => {
    setLoading(true);
    try {
      let url = 'http://localhost:8081/fleet-management/crews';
      if (name) {
        url += `?name=${encodeURIComponent(name)}`;
      }
      const response = await axios.get(url);
      setCrews(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching crews:', error);
      setError('Failed to fetch crew data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && selectedCrew) {
        await axios.put(`http://localhost:8081/fleet-management/crews`, { ...formData, id: selectedCrew.id });
        showAlert('Crew member updated successfully', 'success');
      } else {
        await axios.post('http://localhost:8081/fleet-management/crews', formData);
        showAlert('Crew member added successfully', 'success');
      }
      resetForm();
      await fetchCrews(searchTerm);
      onCrewChange();
    } catch (error) {
      console.error('Error managing crew member:', error);
      setError('Failed to save crew member');
      showAlert('Failed to save crew member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (crewId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8081/fleet-management/crews/${crewId}`);
      showAlert('Crew member deleted successfully', 'success');
      await fetchCrews(searchTerm);
      onCrewChange();
    } catch (error) {
      console.error('Error deleting crew member:', error);
      showAlert('Failed to delete crew member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCrewSelect = (crew) => {
    setSelectedCrew(crew);
    setFormData(crew);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', ship_id: '' });
    setSelectedCrew(null);
    setIsEditing(false);
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchCrews(value);
  };

  return (
      <>
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {isEditing ? 'Edit Crew Member' : 'Manage Crew'}
          </DialogTitle>
          <DialogContent sx={{ paddingTop: 2 }}>
            {!isEditing && (
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search crew members by name"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {loading ? (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <>
                {!isEditing && (
                  <Box>
                    <List>
                      {crews.map((crew) => (
                        <ListItem key={crew.id} button onClick={() => handleCrewSelect(crew)}>
                          <ListItemText primary={crew.name} secondary={`Role: ${crew.role} | Ship ID: ${crew.ship_id} | Crew ID: ${crew.id}`} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(crew.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    <Button variant="outlined" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>Add New Crew Member</Button>
                  </Box>
                )}
                {isEditing && (
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>
                      <TextField
                        name="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                      <FormControl fullWidth required>
                        <InputLabel>Role</InputLabel>
                        <Select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          label="Role"
                        >
                          <MenuItem value="Captain">Captain</MenuItem>
                          <MenuItem value="First Mate">First Mate</MenuItem>
                          <MenuItem value="Engineer">Engineer</MenuItem>
                          <MenuItem value="Deck Hand">Deck Hand</MenuItem>
                          <MenuItem value="Medic">Medic</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        name="ship_id"
                        label="Ship ID"
                        type="number"
                        value={formData.ship_id}
                        onChange={handleChange}
                        fullWidth
                        required
                      />
                    </Box>
                    <Box mt={2}>
                      <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {selectedCrew ? 'Update Crew Member' : 'Add Crew Member'}
                      </Button>
                      <Button onClick={resetForm} disabled={loading} sx={{ ml: 1 }}>Cancel</Button>
                    </Box>
                  </form>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>Close</Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </>
    );
  };

  export default ManageCrew;