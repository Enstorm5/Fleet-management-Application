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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const ManageCaptain = ({ open, onClose, onCaptainChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    experience: '',
    shipId: '',
  });
  const [captains, setCaptains] = useState([]);
  const [selectedCaptain, setSelectedCaptain] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchCaptains();
    }
  }, [open]);

  const fetchCaptains = async (name = '') => {
    setLoading(true);
    try {
      let url = 'http://localhost:8084/captain-service/captains';
      if (name) {
        url += `?name=${encodeURIComponent(name)}`;
      }
      const response = await axios.get(url);
      setCaptains(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching captains:', error);
      setError('Failed to fetch captain data');
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
      if (isEditing && selectedCaptain) {
        await axios.put(`http://localhost:8084/captain-service/captains`, { ...formData, id: selectedCaptain.id });
        showAlert('Captain updated successfully', 'success');
      } else {
        await axios.post('http://localhost:8084/captain-service/captains', formData);
        showAlert('Captain added successfully', 'success');
      }
      resetForm();
      await fetchCaptains(searchTerm);
      onCaptainChange();
    } catch (error) {
      console.error('Error managing captain:', error);
      setError('Failed to save captain,License number and assigned ship must be unique');
      showAlert('Failed to save captain,License number and assigned ship must be unique', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (captainId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8084/captain-service/captains/${captainId}`);
      showAlert('Captain deleted successfully', 'success');
      await fetchCaptains(searchTerm);
      onCaptainChange();
    } catch (error) {
      console.error('Error deleting captain:', error);
      showAlert('Failed to delete captain', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCaptainSelect = (captain) => {
    setSelectedCaptain(captain);
    setFormData(captain);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ name: '', licenseNumber: '', experience: '', shipId: '' });
    setSelectedCaptain(null);
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
    fetchCaptains(value);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Captain' : 'Manage Captains'}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          {!isEditing && (
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search captains by name"
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
                    {captains.map((captain) => (
                      <ListItem key={captain.id} button onClick={() => handleCaptainSelect(captain)}>
                        <ListItemText
                          primary={captain.name}
                          secondary={`License: ${captain.licenseNumber} | Experience: ${captain.experience} years | Ship ID: ${captain.shipId}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(captain.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  <Button variant="outlined" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>Add New Captain</Button>
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
                    <TextField
                      name="licenseNumber"
                      label="License Number"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      name="experience"
                      label="Experience (years)"
                      type="number"
                      value={formData.experience}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                    <TextField
                      name="shipId"
                      label="Ship ID"
                      type="number"
                      value={formData.shipId}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Box>
                  <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                      {selectedCaptain ? 'Update Captain' : 'Add Captain'}
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

export default ManageCaptain;