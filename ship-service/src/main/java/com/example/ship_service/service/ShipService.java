package com.example.ship_service.service;

import com.example.ship_service.data.Ship;
import com.example.ship_service.data.ShipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShipService {
    @Autowired
    private ShipRepository shipRepository;

    public List<Ship>getShips(){
        return shipRepository.findAll();
    }
    public Ship createShip(Ship ship){
        return shipRepository.save(ship);
    }
    public Ship updateShip(Ship ship){
        return shipRepository.save(ship);
    }

    public Ship deleteShipById(int id){
        Optional<Ship>ship=shipRepository.findById(id);
        if (ship.isPresent()){
            shipRepository.deleteById(id);
        }
        return null;
    }
    public List<Ship>findShipByName(String name){
        return shipRepository.findShipByName(name);
    }
}
