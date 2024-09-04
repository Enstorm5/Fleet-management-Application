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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [crews, setCrews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isManageCrewOpen, setIsManageCrewOpen] = useState(false);

  // Placeholder data for ships, cargo, and captains
  const ships = [
    { id: 1, name: 'Ship 1', status: 'Active', location: 'Port A' },
    { id: 2, name: 'Ship 2', status: 'Maintenance', location: 'Port B' },
  ];
  const cargos = [
    { id: 1, name: 'Cargo 1', weight: '1000 tons', ship_id: 1 },
    { id: 2, name: 'Cargo 2', weight: '1500 tons', ship_id: 2 },
  ];
  const captains = [
    { id: 1, name: 'Captain 1', experience: 10, ship_id: 1 },
    { id: 2, name: 'Captain 2', experience: 15, ship_id: 2 },
  ];

  const [selectedShip, setSelectedShip] = useState(ships[0]);

  useEffect(() => {
    fetchCrews();
  }, []);

  const fetchCrews = async () => {
    try {
      const response = await axios.get('http://localhost:8081/fleet-management/crews');
      setCrews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch crew data');
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

  const handleCrewChange = () => {
    fetchCrews();
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
                {activeTab === 3 && "Captain Assignment"}
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
                        secondary={`Role: ${crew.role} | Ship ID: ${crew.ship_id}`}
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
                      <ListItemText primary={cargo.name} secondary={`Weight: ${cargo.weight}`} />
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
                      <ListItemText primary={captain.name} secondary={`Experience: ${captain.experience} years`} />
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
              } else {
                // Handle other tabs' actions
                console.log("Action for tab:", activeTab);
              }
            }}
          >
            {activeTab === 0 && "Add/Edit Ship"}
            {activeTab === 1 && "Manage Crew"}
            {activeTab === 2 && "Add/Edit Cargo"}
            {activeTab === 3 && "Assign Captain"}
          </Button>
        </Box>
      </Container>
      <ManageCrew
        open={isManageCrewOpen}
        onClose={handleCloseManageCrew}
        onCrewChange={handleCrewChange}
      />
    </>
  );
};

export default Dashboard;