package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TruckRepository extends JpaRepository<Truck, String> {
}
