package com.example.warehouse.persistence.service.impl;

import com.example.warehouse.persistence.dtos.TruckDto;
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
    public List<TruckDto> getAllTrucks() {
        return truckRepository.findAll()
                .stream()
                .map(TruckDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateTruck(TruckDto truckDto) {
        truckRepository.save(truckDto.toEntity());
    }

    @Override
    @Transactional
    public void deleteTruck(String id) {
        truckRepository.deleteById(id);
    }
}
