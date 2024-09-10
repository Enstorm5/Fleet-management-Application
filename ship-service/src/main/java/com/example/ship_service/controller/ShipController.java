package com.example.ship_service.controller;

import com.example.ship_service.ShipServiceApplication;
import com.example.ship_service.data.Ship;
import com.example.ship_service.service.ShipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8005")
public class ShipController {
    @Autowired
    private ShipService shipService;

    @GetMapping(path="/ships")
    public List<Ship>findAllShips(){
        return shipService.getShips();
    }
}
