package com.example.crew.service;

import com.example.crew.data.Crew;
import com.example.crew.data.CrewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
