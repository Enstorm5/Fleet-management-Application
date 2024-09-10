import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const ManageShip = ({ open, onClose, onShipChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: '',
    location: '',
  });
  const [ships, setShips] = useState([]);
  const [selectedShip, setSelectedShip] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchShips();
    }
  }, [open]);

  const fetchShips = async (name = '') => {
    setLoading(true);
    try {
      let url = 'http://localhost:8082/ship-service/ships';
      if (name) {
        url += `?name=${encodeURIComponent(name)}`;
      }
      const response = await axios.get(url);
      setShips(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching ships:', error);
      setError('Failed to fetch ship data');
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
      if (isEditing && selectedShip) {
        await axios.put(`http://localhost:8082/ship-service/ships`, { ...formData, id: selectedShip.id });
        showAlert('Ship updated successfully', 'success');
      } else {
        await axios.post('http://localhost:8082/ship-service/ships', formData);
        showAlert('Ship added successfully', 'success');
      }
      resetForm();
      await fetchShips(searchTerm);
      onShipChange();
    } catch (error) {
      console.error('Error managing ship:', error);
      setError('Failed to save ship');
      showAlert('Failed to save ship', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shipId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8082/ship-service/ships/${shipId}`);
      showAlert('Ship deleted successfully', 'success');
      await fetchShips(searchTerm);
      onShipChange();
    } catch (error) {
      console.error('Error deleting ship:', error);
      showAlert('Failed to delete ship', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShipSelect = (ship) => {
    setSelectedShip(ship);
    setFormData(ship);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ name: '', type: '', status: '', location: '' });
    setSelectedShip(null);
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
    fetchShips(value);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Ship' : 'Manage Ships'}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          {!isEditing && (
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search ships by name"
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
                    {ships.map((ship) => (
                      <ListItem key={ship.id} button onClick={() => handleShipSelect(ship)}>
                        <ListItemText
                          primary={ship.name}
                          secondary={`Type: ${ship.type} | Status: ${ship.status} | Location: ${ship.location}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(ship.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  <Button variant="outlined" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>Add New Ship</Button>
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
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                      labelId="type-label"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      label="Type"
                      >
                         <MenuItem value="Cargo">Cargo</MenuItem>
                         <MenuItem value="Research">Research</MenuItem>
                         <MenuItem value="Oil Tanker">Oil Tanker</MenuItem>
                         <MenuItem value="Supply Vessel">Supply Vessel</MenuItem>
                        </Select>
                      </FormControl>


                    <FormControl fullWidth required>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        labelId="status-label"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Status"
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Maintenance">Maintenance</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      name="location"
                      label="Location"
                      value={formData.location}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Box>
                  <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                      {selectedShip ? 'Update Ship' : 'Add Ship'}
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

export default ManageShip;