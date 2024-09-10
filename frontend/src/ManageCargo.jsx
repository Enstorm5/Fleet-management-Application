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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageCargo = ({ open, onClose, onCargoChange }) => {
  const [formData, setFormData] = useState({
    description: '',
    weight: '',
    destination: '',
    shipID: '',
  });
  const [cargos, setCargos] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    if (open) {
      fetchCargos();
    }
  }, [open]);

  const fetchCargos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8083/cargo-service/cargos');
      setCargos(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching cargos:', error);
      setError('Failed to fetch cargo data');
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
      if (isEditing && selectedCargo) {
        await axios.put(`http://localhost:8083/cargo-service/cargos`, { ...formData, id: selectedCargo.id });
        showAlert('Cargo updated successfully', 'success');
      } else {
        await axios.post('http://localhost:8083/cargo-service/cargos', formData);
        showAlert('Cargo added successfully', 'success');
      }
      resetForm();
      await fetchCargos();
      onCargoChange();
    } catch (error) {
      console.error('Error managing cargo:', error);
      setError('Failed to save cargo');
      showAlert('Failed to save cargo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cargoId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8083/cargo-service/cargos/${cargoId}`);
      showAlert('Cargo deleted successfully', 'success');
      await fetchCargos();
      onCargoChange();
    } catch (error) {
      console.error('Error deleting cargo:', error);
      showAlert('Failed to delete cargo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCargoSelect = (cargo) => {
    setSelectedCargo(cargo);
    setFormData(cargo);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ description: '', weight: '', destination: '', shipID: '' });
    setSelectedCargo(null);
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

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Cargo' : 'Manage Cargo'}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
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
                    {cargos.map((cargo) => (
                      <ListItem key={cargo.id} button onClick={() => handleCargoSelect(cargo)}>
                        <ListItemText
                          primary={cargo.description}
                          secondary={`Weight: ${cargo.weight} KG | Destination: ${cargo.destination} | Ship ID: ${cargo.shipID}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(cargo.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  <Button variant="outlined" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>Add New Cargo</Button>
                </Box>
              )}
              {isEditing && (
                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>
                    <TextField
                      name="description"
                      label="Description"
                      value={formData.description}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      name="weight"
                      label="Weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      name="destination"
                      label="Destination"
                      value={formData.destination}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      name="shipID"
                      label="Ship ID"
                      type="number"
                      value={formData.shipID}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Box>
                  <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                      {selectedCargo ? 'Update Cargo' : 'Add Cargo'}
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

export default ManageCargo;