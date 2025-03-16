package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.dtos.TruckDto;
import com.example.warehouse.persistence.entity.Truck;

import java.util.List;

public interface TruckService {

    void createTruck(TruckDto truckDto);

    List<Truck> getAllTrucks();

    void updateTruck(Truck truck);

    void deleteTruck(Long id);
}
