package com.example.warehouse.controller;

import com.example.warehouse.persistence.dtos.TruckDto;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.service.TruckService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager/trucks")
@CrossOrigin(origins = "http://localhost:4200")
public class TruckController {


    private final TruckService truckService;

    public TruckController(TruckService truckService) {
        this.truckService = truckService;
    }

    @PostMapping
    public void createTruck(@RequestBody TruckDto truck) {
         truckService.createTruck(truck);
    }

    @GetMapping
    public List<TruckDto> getAllTrucks() {
        return truckService.getAllTrucks();
    }

    @PutMapping("/{truckId}")
    public void updateTruck(@PathVariable Long truckId, @RequestBody Truck truck) {
        truck.setId(truckId);
        truckService.updateTruck(TruckDto.fromEntity(truck));
    }

    @DeleteMapping("/{truckId}")
    public void deleteTruck(@PathVariable Long truckId) {
        truckService.deleteTruck(truckId);
    }
}
