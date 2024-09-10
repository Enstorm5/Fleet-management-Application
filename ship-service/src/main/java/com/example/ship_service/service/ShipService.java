package com.example.ship_service.service;

import com.example.ship_service.data.Ship;
import com.example.ship_service.data.ShipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShipService {
    @Autowired
    private ShipRepository shipRepository;

    public List<Ship>getShips(){
        return shipRepository.findAll();
    }
}
