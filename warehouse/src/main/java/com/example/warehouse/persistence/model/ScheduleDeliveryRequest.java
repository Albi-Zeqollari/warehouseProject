package com.example.warehouse.persistence.model;


import com.example.warehouse.persistence.entity.Truck;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ScheduleDeliveryRequest {
    private Long orderId;
    private LocalDate deliveryDate;
    private List<Long> truckIds;

}
