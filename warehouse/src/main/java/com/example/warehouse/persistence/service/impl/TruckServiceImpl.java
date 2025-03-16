package com.example.warehouse.persistence.service.impl;

import com.example.warehouse.persistence.dtos.TruckDto;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.repository.TruckRepository;
import com.example.warehouse.persistence.service.TruckService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TruckServiceImpl implements TruckService {


    private final TruckRepository truckRepository;

    public TruckServiceImpl(TruckRepository truckRepository) {
        this.truckRepository = truckRepository;
    }


    @Transactional
    public void createTruck(TruckDto truckDto) {
        truckRepository.save(truckDto.toEntity());
    }

    @Override
    @Transactional
    public List<Truck>getAllTrucks() {
        return truckRepository.findAll();

    }

    @Override
    @Transactional
    public void updateTruck(Truck truck) {
        truckRepository.updateTruckById(truck.getLicensePlate(),truck.getChassisNumber(),truck.getId());
    }

    @Override
    @Transactional
    public void deleteTruck(Long id) {
        truckRepository.deleteById(id);
    }
}
