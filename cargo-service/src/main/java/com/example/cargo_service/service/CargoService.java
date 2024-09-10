package com.example.cargo_service.service;

import com.example.cargo_service.data.Cargo;
import com.example.cargo_service.data.CargoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CargoService {
    @Autowired
    private CargoRepository cargoRepository;

    public List<Cargo>getCargos(){
        return cargoRepository.findAll();
    }
    public Cargo createCargo(Cargo cargo){
        return cargoRepository.save(cargo);
    }
    public Cargo updateCargo(Cargo cargo){
        return cargoRepository.save(cargo);
    }

    public Cargo deleteCargoById(int id){
        Optional<Cargo> cargo=cargoRepository.findById(id);
        if (cargo.isPresent()){
            cargoRepository.deleteById(id);
        }
        return null;
    }

}
