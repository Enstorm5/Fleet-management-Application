package com.example.crew.controller;

import com.example.crew.data.Crew;
import com.example.crew.service.CrewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class CrewController {
    @Autowired
    private CrewService crewService;

    @GetMapping(path ="/crews")
    public List<Crew>findAllCrews(){
        return crewService.getCrew();
    }
    @PostMapping(path="/crews")
    public Crew createCrew(@RequestBody Crew crew){
        return crewService.createcrew(crew);
    }
    @PutMapping(path="/crews")
    public Crew updateCrew(@RequestBody Crew crew) {
        return crewService.updateCrew(crew);
    }


}
