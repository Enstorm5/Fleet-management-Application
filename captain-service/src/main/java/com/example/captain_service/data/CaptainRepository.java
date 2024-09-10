package com.example.captain_service.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CaptainRepository extends JpaRepository<Captain,Integer> {
    @Query("Select c from Captain c where c.name=?1")
    List<Captain> findCaptainByName(String name);
}
