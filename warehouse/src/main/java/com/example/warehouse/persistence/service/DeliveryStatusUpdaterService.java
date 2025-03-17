package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.entity.Delivery;
import com.example.warehouse.persistence.repository.DeliveryRepository;
import com.example.warehouse.persistence.repository.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DeliveryStatusUpdaterService {


    private  final DeliveryRepository deliveryRepository;


    private final OrderRepository orderRepository;

    public DeliveryStatusUpdaterService(DeliveryRepository deliveryRepository, OrderRepository orderRepository) {
        this.deliveryRepository = deliveryRepository;
        this.orderRepository = orderRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void updateDeliveryStatus() {
        LocalDate today = LocalDate.now();
        List<Delivery> deliveries = deliveryRepository.findByDeliveryDateBeforeAndOrder_Status(today, "UNDER_DELIVERY");
        for (Delivery delivery : deliveries) {
            delivery.getOrder().setStatus("FULFILLED");
            orderRepository.save(delivery.getOrder());
        }
    }
}
