package com.example.crew_service.controller;

import com.example.crew_service.data.Crew;
import com.example.crew_service.service.CrewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8005")

public class CrewController {
    @Autowired
    private CrewService crewService;

    @GetMapping(path ="/crews")
    public List<Crew>findAllCrews(){
        return crewService.getCrews();
    }
    @PostMapping(path="/crews")
    public Crew createCrew(@RequestBody Crew crew){
        return crewService.createCrew(crew);
    }
    @PutMapping(path="/crews")
    public Crew updateCrew(@RequestBody Crew crew) {
        return crewService.updateCrew(crew);
    }
    @DeleteMapping(path ="/crews/{id}")
    public Crew deleteCrewById(@PathVariable int id){
        return crewService.deleteCrewById(id);
    }
    @GetMapping(path="/crews",params = "name")
    public List<Crew>findCrewByName(@RequestParam String name){
        return crewService.findCrewByName(name);
    }



}
