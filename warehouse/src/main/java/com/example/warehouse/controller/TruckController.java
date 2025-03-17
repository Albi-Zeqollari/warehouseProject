package com.example.warehouse.controller;

import com.example.warehouse.persistence.dtos.TruckDto;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.service.DeliveryService;
import com.example.warehouse.persistence.service.TruckService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/manager/trucks")
@CrossOrigin(origins = "http://localhost:4200")
public class TruckController {


    private final TruckService truckService;
    private final DeliveryService deliveryService;

    public TruckController(TruckService truckService, DeliveryService deliveryService) {
        this.truckService = truckService;
        this.deliveryService = deliveryService;
    }

    @PostMapping
    public void createTruck(@RequestBody TruckDto truck) {
         truckService.createTruck(truck);
    }

    @GetMapping
    public List<TruckDto> getAllTrucks() {
        return truckService.getAllTrucks();
    }

    @PutMapping("/updateTruck")
    public void updateTruck(@RequestBody Truck truck) {
        truckService.updateTruck(truck);
    }

    @GetMapping("/available")
    public ResponseEntity<List<TruckDto>> getAvailableTrucks(@RequestParam("deliveryDate") LocalDate deliveryDate) {
        List<TruckDto> availableTrucks = truckService.getAvailableTrucks(deliveryDate);
        return ResponseEntity.ok(availableTrucks);
    }

    @DeleteMapping("/{truckId}")
    public void deleteTruck(@PathVariable Long truckId) {
        truckService.deleteTruck(truckId);
    }

}
