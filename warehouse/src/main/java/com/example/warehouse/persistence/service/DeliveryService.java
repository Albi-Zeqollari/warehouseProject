package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.model.ScheduleDeliveryRequest;

public interface DeliveryService {

    void scheduleDelivery(ScheduleDeliveryRequest  scheduleDeliveryRequest);
}
