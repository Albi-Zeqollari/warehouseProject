package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TruckRepository extends JpaRepository<Truck, Long> {

    @Modifying
    @Query("UPDATE Truck u SET u.licensePlate = :licensePlate, u.chassisNumber = :chassisNumber WHERE u.id = :id")
    void updateTruckById(@Param("licensePlate") String licensePlate,
                        @Param("chassisNumber") String chassisNumber,
                        @Param("id") Long id);


    @Modifying
    @Query("SELECT t FROM Truck t WHERE t.id NOT IN (" +
            "SELECT dt.id FROM Delivery d JOIN d.trucks dt " +
            "WHERE d.deliveryDate = :deliveryDate" +
            ")")
    List<Truck> findAvailableTrucks(@Param("deliveryDate") LocalDate deliveryDate);

}
