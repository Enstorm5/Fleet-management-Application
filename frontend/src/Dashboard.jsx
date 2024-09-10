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
  Divider,
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
import ManageShip from './ManageShip';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [ships, setShips] = useState([]);
  const [crews, setCrews] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [captains, setCaptains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isManageShipOpen, setIsManageShipOpen] = useState(false);
  const [isManageCrewOpen, setIsManageCrewOpen] = useState(false);
  const [isManageCargoOpen, setIsManageCargoOpen] = useState(false);
  const [isManageCaptainOpen, setIsManageCaptainOpen] = useState(false);

  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedShipCrew, setSelectedShipCrew] = useState([]);
  const [selectedShipCargo, setSelectedShipCargo] = useState([]);
  const [selectedShipCaptain, setSelectedShipCaptain] = useState(null);

  useEffect(() => {
    fetchShips();
    fetchCrews();
    fetchCargos();
    fetchCaptains();
  }, []);

  useEffect(() => {
    if (selectedShip) {
      fetchShipDetails(selectedShip.id);
    }
  }, [selectedShip]);

  const fetchShips = async () => {
    try {
      const response = await axios.get('http://localhost:8082/ship-service/ships');
      setShips(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch ship data');
      setLoading(false);
    }
  };

  const fetchCrews = async () => {
    try {
      const response = await axios.get('http://localhost:8081/crew-service/crews');
      setCrews(response.data);
    } catch (err) {
      console.error('Failed to fetch crew data', err);
    }
  };

  const fetchCargos = async () => {
    try {
      const response = await axios.get('http://localhost:8083/cargo-service/cargos');
      setCargos(response.data);
    } catch (err) {
      console.error('Failed to fetch cargo data', err);
    }
  };

  const fetchCaptains = async () => {
    try {
      const response = await axios.get('http://localhost:8084/captain-service/captains');
      setCaptains(response.data);
    } catch (err) {
      console.error('Failed to fetch captain data', err);
    }
  };

  const fetchShipDetails = async (shipId) => {
    try {
      const [crewResponse, cargoResponse, captainResponse] = await Promise.all([
        axios.get(`http://localhost:8081/crew-service/crews?shipId=${shipId}`),
        axios.get(`http://localhost:8083/cargo-service/cargos?shipId=${shipId}`),
        axios.get(`http://localhost:8084/captain-service/captains?shipId=${shipId}`)
      ]);

      setSelectedShipCrew(crewResponse.data);
      setSelectedShipCargo(cargoResponse.data);
      setSelectedShipCaptain(captainResponse.data); // Assuming one captain per ship
    } catch (err) {
      console.error('Failed to fetch ship details', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleShipSelect = (ship) => {
    setSelectedShip(ship);
  };

  const handleOpenManageShip = () => {
    setIsManageShipOpen(true);
  };

  const handleCloseManageShip = () => {
    setIsManageShipOpen(false);
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

  const handleShipChange = () => {
    fetchShips();
  };

  const handleCrewChange = () => {
    fetchCrews();
    if (selectedShip) {
      fetchShipDetails(selectedShip.id);
    }
  };

  const handleCargoChange = () => {
    fetchCargos();
    if (selectedShip) {
      fetchShipDetails(selectedShip.id);
    }
  };

  const handleCaptainChange = () => {
    fetchCaptains();
    if (selectedShip) {
      fetchShipDetails(selectedShip.id);
    }
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
                      secondary={`Type: ${ship.type} | Status: ${ship.status} | Location: ${ship.location}`}
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
                  <Typography>Type: {selectedShip.type}</Typography>
                  <Typography>Status: {selectedShip.status}</Typography>
                  <Typography>Location: {selectedShip.location}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Captain</Typography>
                  {selectedShipCaptain ? (
                    <Typography>{selectedShipCaptain.name} - License: {selectedShipCaptain.licenseNumber}</Typography>
                  ) : (
                    <Typography>No captain assigned</Typography>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Crew</Typography>
                  {selectedShipCrew.length > 0 ? (
                    <List>
                      {selectedShipCrew.map((crewMember) => (
                        <ListItem key={crewMember.id}>
                          <ListItemText primary={crewMember.name} secondary={`Role: ${crewMember.role}`} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No crew assigned</Typography>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Cargo</Typography>
                  {selectedShipCargo.length > 0 ? (
                    <List>
                      {selectedShipCargo.map((cargo) => (
                        <ListItem key={cargo.id}>
                          <ListItemText primary={cargo.description} secondary={`Weight: ${cargo.weight}, Destination: ${cargo.destination}`} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography>No cargo assigned</Typography>
                  )}
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
                        secondary={`Weight: ${cargo.weight} | Destination: ${cargo.destination} | Ship ID: ${cargo.shipId}`}
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
              if (activeTab === 0) {
                handleOpenManageShip();
              } else if (activeTab === 1) {
                handleOpenManageCrew();
              } else if (activeTab === 2) {
                handleOpenManageCargo();
              } else if (activeTab === 3) {
                handleOpenManageCaptain();
              }
            }}
          >
            {activeTab === 0 && "Manage Ships"}
            {activeTab === 1 && "Manage Crew"}
            {activeTab === 2 && "Manage Cargo"}
            {activeTab === 3 && "Manage Captain"}
          </Button>
        </Box>
      </Container>
      <ManageShip
        open={isManageShipOpen}
        onClose={handleCloseManageShip}
        onShipChange={handleShipChange}
      />
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