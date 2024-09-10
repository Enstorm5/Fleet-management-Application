package com.example.cargo_service.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CargoRepository extends JpaRepository<Cargo,Integer> {
    @Query("Select c from Cargo c where c.shipId=?1")
    List<Cargo> findCargoByShipId(Integer shipId);

}
