import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const ManageCrew = ({ open, onClose }) => {
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

  useEffect(() => {
    if (open) {
      fetchCrews();
    }
  }, [open]);

  const fetchCrews = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/fleet-management/crews');
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
        await axios.put(`http://localhost:8081/fleet-management/crews`, formData);
      } else {
        await axios.post('http://localhost:8081/fleet-management/crews', formData);
      }
      resetForm();
      await fetchCrews();
    } catch (error) {
      console.error('Error managing crew member:', error);
      setError('Failed to save crew member');
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Crew Member' : 'Manage Crew'}</DialogTitle>

      <DialogContent>

        {loading ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            {!isEditing && (
              <Box mb={2}>
                <Typography variant="h6">Select a crew member to edit:</Typography>
                <List>
                  {crews.map((crew) => (
                    <ListItem key={crew.id} button onClick={() => handleCrewSelect(crew)}>
                      <ListItemText primary={crew.name} secondary={`Role: ${crew.role} | Ship ID: ${crew.ship_id} | Crew ID: ${crew.id} `} />
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" onClick={() => setIsEditing(true)}>Add New Crew Member</Button>
              </Box>
            )}
            {isEditing && (
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                      <MenuItem value="Deck Hand">Medic</MenuItem>
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
                  <Button onClick={resetForm} disabled={loading}>Cancel</Button>
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
  );
};

export default ManageCrew;