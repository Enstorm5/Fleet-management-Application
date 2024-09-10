package com.example.cargo_service.controller;

import com.example.cargo_service.data.Cargo;
import com.example.cargo_service.service.CargoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8005")

public class CargoController {
    @Autowired
    private CargoService cargoService;

    @GetMapping(path = "/cargos")
    public List<Cargo> findAllCargos() {
        return cargoService.getCargos();
    }

    @GetMapping(path = "/cargos/{id}")
    public Cargo findCargoById(@PathVariable int id) {
        return cargoService.getCargoById(id);
    }

    @PostMapping(path = "/cargos")
    public Cargo createCargo(@RequestBody Cargo cargo){
        return cargoService.createCargo(cargo);
    }

    @PutMapping(path="/cargos")
    public Cargo updateCargo(@RequestBody Cargo cargo) {
        return cargoService.updateCargo(cargo);
    }
    @DeleteMapping(path ="/cargos/{id}")
    public Cargo deleteCargoById(@PathVariable int id){
        return cargoService.deleteCargoById(id);
    }


}

