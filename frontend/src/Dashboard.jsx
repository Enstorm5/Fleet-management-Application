import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  DirectionsBoat as ShipIcon,
  Person as CrewIcon,
  Inventory as CargoIcon,
  Stars as CaptainIcon,
} from '@mui/icons-material';
import ManageCrew from './ManageCrew';
import ManageCargo from './ManageCargo';
import ManageCaptain from './ManageCaptain';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [crews, setCrews] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isManageCrewOpen, setIsManageCrewOpen] = useState(false);
  const [isManageCargoOpen, setIsManageCargoOpen] = useState(false);
  const [isManageCaptainOpen, setIsManageCaptainOpen] = useState(false);

  // Placeholder data for ships
  const ships = [
    { id: 1, name: 'Ship 1', status: 'Active', location: 'Port A' },
    { id: 2, name: 'Ship 2', status: 'Maintenance', location: 'Port B' },
  ];

  const [selectedShip, setSelectedShip] = useState(ships[0]);

  useEffect(() => {
    fetchCrews();
    fetchCargos();
    fetchCaptains();
  }, []);

  const fetchCrews = async () => {
    try {
      const response = await axios.get('http://localhost:8081/crew-service/crews');
      setCrews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch crew data');
      setLoading(false);
    }
  };

  const fetchCargos = async () => {
    try {
      const response = await axios.get('http://localhost:8083/cargo-service/cargos');
      setCargos(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cargo data');
      setLoading(false);
    }
  };

  const fetchCaptains = async () => {
    try {
      const response = await axios.get('http://localhost:8084/captain-service/captains');
      setCaptains(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch captain data');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleShipSelect = (ship) => {
    setSelectedShip(ship);
  };

  const handleOpenManageCrew = () => {
    setIsManageCrewOpen(true);
  };

  const handleCloseManageCrew = () => {
    setIsManageCrewOpen(false);
  };

  const handleOpenManageCargo = () => {
    setIsManageCargoOpen(true);
  };

  const handleCloseManageCargo = () => {
    setIsManageCargoOpen(false);
  };

  const handleOpenManageCaptain = () => {
    setIsManageCaptainOpen(true);
  };

  const handleCloseManageCaptain = () => {
    setIsManageCaptainOpen(false);
  };

  const handleCrewChange = () => {
    fetchCrews();
  };

  const handleCargoChange = () => {
    fetchCargos();
  };

  const handleCaptainChange = () => {
    fetchCaptains();
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fleet Management
          </Typography>
          <Tabs value={activeTab} onChange={handleTabChange} textColor="inherit">
            <Tab label="Ships" icon={<ShipIcon />} iconPosition="start" />
            <Tab label="Crew" icon={<CrewIcon />} iconPosition="start" />
            <Tab label="Cargo" icon={<CargoIcon />} iconPosition="start" />
            <Tab label="Captains" icon={<CaptainIcon />} iconPosition="start" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Ships Overview
              </Typography>
              <List>
                {ships.map((ship) => (
                  <ListItem
                    key={ship.id}
                    button
                    onClick={() => handleShipSelect(ship)}
                    selected={selectedShip && selectedShip.id === ship.id}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <ShipIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={ship.name}
                      secondary={`Status: ${ship.status} | Location: ${ship.location}`}
                    />
                  </ListItem>
                ))}
              </List>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                {activeTab === 0 && "Ship Details"}
                {activeTab === 1 && "Crew Overview"}
                {activeTab === 2 && "Cargo Overview"}
                {activeTab === 3 && "Captain Overview"}
              </Typography>
              {activeTab === 0 && selectedShip && (
                <Box>
                  <Typography variant="h5">{selectedShip.name}</Typography>
                  <Typography>Status: {selectedShip.status}</Typography>
                  <Typography>Location: {selectedShip.location}</Typography>
                </Box>
              )}
              {activeTab === 1 && (
                <List>
                  {crews.map((crew) => (
                    <ListItem key={crew.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <CrewIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={crew.name}
                        secondary={`Role: ${crew.role} | Ship ID: ${crew.shipId} | Crew ID: ${crew.id}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              {activeTab === 2 && (
                <List>
                  {cargos.map((cargo) => (
                    <ListItem key={cargo.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <CargoIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={cargo.description}
                        secondary={`Weight: ${cargo.weight} | Destination: ${cargo.destination} | Ship ID: ${cargo.shipID}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              {activeTab === 3 && (
                <List>
                  {captains.map((captain) => (
                    <ListItem key={captain.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <CaptainIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={captain.name}
                        secondary={`License: ${captain.licenseNumber} | Experience: ${captain.experience} years | Ship ID: ${captain.shipId}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (activeTab === 1) {
                handleOpenManageCrew();
              } else if (activeTab === 2) {
                handleOpenManageCargo();
              } else if (activeTab === 3) {
                handleOpenManageCaptain();
              } else {
                // Handle other tabs' actions
                console.log("Action for tab:", activeTab);
              }
            }}
          >
            {activeTab === 0 && "Add/Edit Ship"}
            {activeTab === 1 && "Manage Crew"}
            {activeTab === 2 && "Manage Cargo"}
            {activeTab === 3 && "Manage Captain"}
          </Button>
        </Box>
      </Container>
      <ManageCrew
        open={isManageCrewOpen}
        onClose={handleCloseManageCrew}
        onCrewChange={handleCrewChange}
      />
      <ManageCargo
        open={isManageCargoOpen}
        onClose={handleCloseManageCargo}
        onCargoChange={handleCargoChange}
      />
      <ManageCaptain
        open={isManageCaptainOpen}
        onClose={handleCloseManageCaptain}
        onCaptainChange={handleCaptainChange}
      />
    </>
  );
};

export default Dashboard;