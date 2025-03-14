package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.dtos.TruckDto;
import com.example.warehouse.persistence.entity.Truck;

import java.util.List;

public interface TruckService {

    void createTruck(TruckDto truckDto);

    List<TruckDto> getAllTrucks();

    void updateTruck(TruckDto truck);

    void deleteTruck(Long id);
}
