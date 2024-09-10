package com.example.ship_service.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipRepository extends JpaRepository<Ship,Integer> {
    @Query("Select c from Ship c where c.name=?1")
    List<Ship> findShipByName(String name);
}
