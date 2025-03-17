package com.example.warehouse.persistence.service.impl;

import com.example.warehouse.persistence.dtos.TruckDto;
import com.example.warehouse.persistence.entity.*;
import com.example.warehouse.persistence.model.ScheduleDeliveryRequest;
import com.example.warehouse.persistence.repository.DeliveryRepository;
import com.example.warehouse.persistence.repository.ItemRepository;
import com.example.warehouse.persistence.repository.OrderRepository;
import com.example.warehouse.persistence.repository.TruckRepository;
import com.example.warehouse.persistence.service.DeliveryService;
import com.example.warehouse.persistence.service.TruckService;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@Log4j2
public class DeliveryServiceImpl implements DeliveryService {

    private final ItemRepository itemRepository;
    private final OrderRepository orderRepository;
    private final DeliveryRepository deliveryRepository;
    private final TruckRepository truckRepository;

    public DeliveryServiceImpl(ItemRepository itemRepository,
                               OrderRepository orderRepository,
                               DeliveryRepository deliveryRepository,
                               TruckRepository truckRepository) {
        this.itemRepository = itemRepository;
        this.orderRepository = orderRepository;
        this.truckRepository = truckRepository;
        this.deliveryRepository = deliveryRepository;
    }

    @Override
    @Transactional
    public void scheduleDelivery(ScheduleDeliveryRequest request) {
        log.info("Starting delivery scheduling for order ID: {}", request.getOrderId());
        LocalDate deliveryDate = request.getDeliveryDate();

        if (deliveryDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
            log.info("Attempted to schedule delivery on a Sunday: {}", deliveryDate);
            throw new IllegalArgumentException("Deliveries cannot be scheduled on Sundays.");
        }

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> {
                    log.info("Order not found for ID: {}", request.getOrderId());
                    return new RuntimeException("Order not found.");
                });

        if (!"APPROVED".equalsIgnoreCase(order.getStatus())) {
            log.info("Order with ID: {} is not approved. Current status: {}", order.getId(), order.getStatus());
            throw new RuntimeException("Only approved orders can be scheduled for delivery.");
        }

        int totalRequestedItems = order.getOrderItems().stream()
                .mapToInt(OrderItem::getRequestedQuantity)
                .sum();
        log.info("Total requested items for order ID {}: {}", order.getId(), totalRequestedItems);

        List<Truck> selectedTrucks = truckRepository.findAllById(request.getTruckIds());
        if (selectedTrucks.isEmpty()) {
            log.info("No trucks selected for delivery for order ID: {}", order.getId());
            throw new RuntimeException("No trucks selected for delivery.");
        }

        int totalCapacity = selectedTrucks.size() * 10;
        if (totalCapacity < totalRequestedItems) {
            log.info("Insufficient truck capacity: Total capacity {} items vs requested {} items for order ID: {}",
                    totalCapacity, totalRequestedItems, order.getId());
            throw new RuntimeException("Selected trucks do not have enough capacity. " +
                    "Total capacity: " + totalCapacity + " items, but order has " + totalRequestedItems + " items.");
        }

        for (Truck truck : selectedTrucks) {
            boolean isTruckBusy = deliveryRepository.existsByDeliveryDateAndTrucksContains(deliveryDate, truck);
            if (isTruckBusy) {
                log.info("Truck {} is already scheduled for a delivery on {}", truck.getLicensePlate(), deliveryDate);
                throw new RuntimeException("Truck " + truck.getLicensePlate() +
                        " is already scheduled for a delivery on " + deliveryDate);
            }
        }

        Delivery delivery = new Delivery();
        delivery.setDeliveryDate(deliveryDate);
        delivery.setOrder(order);
        delivery.setTrucks(selectedTrucks);
        deliveryRepository.save(delivery);
        log.info("Delivery scheduled successfully on {} for order ID: {}", deliveryDate, order.getId());

        order.setStatus("UNDER_DELIVERY");
        orderRepository.save(order);
        log.info("Order status updated to UNDER_DELIVERY for order ID: {}", order.getId());

        order.getOrderItems().forEach(orderItem -> {
            Item item = orderItem.getItem();
            int newQuantity = item.getQuantity() - orderItem.getRequestedQuantity();
            if (newQuantity < 0) {
                log.info("Insufficient quantity for item: {}. Requested: {}, Available: {}",
                        item.getName(), orderItem.getRequestedQuantity(), item.getQuantity());
                throw new RuntimeException("Insufficient quantity for item: " + item.getName());
            }
            item.setQuantity(newQuantity);
            itemRepository.save(item);
            log.info("Updated item {} quantity to {}", item.getName(), newQuantity);
        });
    }
}
