package com.example.ship_service.controller;

import com.example.ship_service.ShipServiceApplication;
import com.example.ship_service.data.Ship;
import com.example.ship_service.service.ShipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    @PostMapping(path="/ships")
    public Ship createShip(@RequestBody Ship ship){
        return shipService.createShip(ship);
    }
    @PutMapping(path="/ships")
    public Ship updateShip(@RequestBody Ship ship) {
        return shipService.updateShip(ship);
    }
    @DeleteMapping(path ="/ships/{id}")
    public Ship deleteShipById(@PathVariable int id){
        return shipService.deleteShipById(id);
    }
    @GetMapping(path="/ships",params = "name")
    public List<Ship>findShipByName(@RequestParam String name){
        return shipService.findShipByName(name);
    }

}
