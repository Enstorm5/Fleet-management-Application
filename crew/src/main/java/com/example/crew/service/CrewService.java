package com.example.crew.service;

import com.example.crew.data.Crew;
import com.example.crew.data.CrewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CrewService {
    @Autowired
    private CrewRepository crewRepository;

    public List<Crew> getCrew(){
        return crewRepository.findAll();
    }
    public Crew createcrew(Crew crew){
        return crewRepository.save(crew);
    }
    public Crew updateCrew(Crew crew){
        return crewRepository.save(crew);
    }

    public Crew deleteCrewById(int id){
        Optional<Crew> crew=crewRepository.findById(id);
        if (crew.isPresent()){
            crewRepository.deleteById(id);
        }
        return null;
    }
    public List<Crew>findCrewByName(String name){
        return crewRepository.findCrewByName(name);
    }

}
