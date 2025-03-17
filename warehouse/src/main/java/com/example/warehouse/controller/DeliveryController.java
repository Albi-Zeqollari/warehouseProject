package com.example.warehouse.controller;

import com.example.warehouse.persistence.model.ScheduleDeliveryRequest;
import com.example.warehouse.persistence.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @Autowired
    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleDelivery(@RequestBody ScheduleDeliveryRequest request) {
        try {
            deliveryService.scheduleDelivery(request);
            return ResponseEntity.ok("Delivery scheduled successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid request: " + e.getMessage());
        } catch (Exception e) {
            // Log the exception as needed
            return ResponseEntity.badRequest().body("Error scheduling delivery: " + e.getMessage());
        }
    }
}
