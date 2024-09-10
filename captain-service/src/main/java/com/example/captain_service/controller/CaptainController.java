package com.example.captain_service.controller;

import com.example.captain_service.data.Captain;
import com.example.captain_service.service.CaptainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:8005")

public class CaptainController {
    @Autowired
    private CaptainService captainService;

    @GetMapping(path = "/captains")
    public List<Captain>findAllCaptains(){
        return captainService.getAllCaptains();
    }
    @PostMapping(path="/captains")
    public Captain createCaptain(@RequestBody Captain captain){
        return captainService.createCaptain(captain);
    }
    @PutMapping(path="/captains")
    public Captain updateCaptain(@RequestBody Captain captain) {
        return captainService.updateCaptain(captain);
    }
    @DeleteMapping(path ="/captains/{id}")
    public Captain deleteCaptainById(@PathVariable int id){
        return captainService.deleteCaptainById(id);
    }

    @GetMapping(path="/captains",params = "name")
    public List<Captain>findCaptainByName(@RequestParam String name){
        return captainService.findCaptainByName(name);
    }


    @GetMapping(path = "/captains", params = "shipId")
    public Optional<Captain> findCaptainByShipId(@RequestParam int shipId) {
        return captainService.getCaptainByShipId(shipId);
    }

}
