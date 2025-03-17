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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
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
        LocalDate deliveryDate = request.getDeliveryDate();

        if (deliveryDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Deliveries cannot be scheduled on Sundays.");
        }

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found."));
        if (!"APPROVED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Only approved orders can be scheduled for delivery.");
        }

        int totalRequestedItems = order.getOrderItems().stream()
                .mapToInt(OrderItem::getRequestedQuantity)
                .sum();

        List<Truck> selectedTrucks = truckRepository.findAllById(request.getTruckIds());
        if (selectedTrucks.isEmpty()) {
            throw new RuntimeException("No trucks selected for delivery.");
        }

        int totalCapacity = selectedTrucks.size() * 10;
        if (totalCapacity < totalRequestedItems) {
            throw new RuntimeException("Selected trucks do not have enough capacity. " +
                    "Total capacity: " + totalCapacity + " items, but order has " + totalRequestedItems + " items.");
        }

        for (Truck truck : selectedTrucks) {
            boolean isTruckBusy = deliveryRepository.existsByDeliveryDateAndTrucksContains(deliveryDate, truck);
            if (isTruckBusy) {
                throw new RuntimeException("Truck " + truck.getLicensePlate() +
                        " is already scheduled for a delivery on " + deliveryDate);
            }
        }

        Delivery delivery = new Delivery();
        delivery.setDeliveryDate(deliveryDate);
        delivery.setOrder(order);
        delivery.setTrucks(selectedTrucks);
        deliveryRepository.save(delivery);

        order.setStatus("UNDER_DELIVERY");
        orderRepository.save(order);

        order.getOrderItems().forEach(orderItem -> {
            Item item = orderItem.getItem();
            int newQuantity = item.getQuantity() - orderItem.getRequestedQuantity();
            if (newQuantity < 0) {
                throw new RuntimeException("Insufficient quantity for item: " + item.getName());
            }
            item.setQuantity(newQuantity);
            itemRepository.save(item);
        });
    }

}
