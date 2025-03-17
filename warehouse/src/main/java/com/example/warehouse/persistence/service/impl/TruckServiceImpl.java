package com.example.warehouse.persistence.service.impl;

import com.example.warehouse.persistence.dtos.TruckDto;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.repository.TruckRepository;
import com.example.warehouse.persistence.service.TruckService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    public List<TruckDto> getAllTrucks() {
        List<Truck> trucks = truckRepository.findAll();
        return trucks.stream()
                .map(truck -> {
                    TruckDto dto = new TruckDto();
                    dto.setId(truck.getId());
                    dto.setChassisNumber(truck.getChassisNumber());
                    dto.setLicensePlate(truck.getLicensePlate());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateTruck(Truck truck) {
        truckRepository.updateTruckById(truck.getLicensePlate(), truck.getChassisNumber(), truck.getId());
    }

    @Override
    @Transactional
    public void deleteTruck(Long id) {
        truckRepository.deleteById(id);
    }


    @Override
    @Transactional
    public List<TruckDto> getAvailableTrucks(LocalDate deliveryDate) {
        List<Truck> trucks = truckRepository.findAvailableTrucks(deliveryDate);
        return trucks.stream()
                .map(truck -> {
                    TruckDto dto = new TruckDto();
                    dto.setId(truck.getId());
                    dto.setChassisNumber(truck.getChassisNumber());
                    dto.setLicensePlate(truck.getLicensePlate());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
