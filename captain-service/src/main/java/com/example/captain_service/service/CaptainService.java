package com.example.captain_service.service;

import com.example.captain_service.data.Captain;
import com.example.captain_service.data.CaptainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CaptainService {
    @Autowired
    private CaptainRepository captainRepository;

    public List<Captain>getAllCaptains(){
        return captainRepository.findAll();
    }

    public Captain createCaptain(Captain captain){
        return captainRepository.save(captain);
    }
    public Captain updateCaptain(Captain captain){
        return captainRepository.save(captain);
    }

    public Captain deleteCaptainById(int id){
        Optional<Captain> captain=captainRepository.findById(id);
        if (captain.isPresent()){
            captainRepository.deleteById(id);
        }
        return null;
    }
    public List<Captain>findCaptainByName(String name){
        return captainRepository.findCaptainByName(name);
    }
    public Optional<Captain> getCaptainByShipId(int shipId) {
        return captainRepository.findCaptainByShipId(shipId);
    }



}
