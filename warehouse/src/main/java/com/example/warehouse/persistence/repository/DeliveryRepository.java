package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.Delivery;
import com.example.warehouse.persistence.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery,Long> {
    boolean existsByDeliveryDateAndTrucksContains(LocalDate deliveryDate, Truck truck);

    List<Delivery> findByDeliveryDateBeforeAndOrder_Status(LocalDate date, String status);

}
