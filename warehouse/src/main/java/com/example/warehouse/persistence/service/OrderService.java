package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.dtos.OrderDto;
import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.Order;
import com.example.warehouse.persistence.entity.OrderStatus;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.entity.User;

import java.util.List;

public interface OrderService {

    OrderDto getOrder(Long orderId);

    void updateOrder(OrderDto orderDto);

    void submitOrder(Long orderId);

    void approveOrder(Long orderId);

    void declineOrder(Long orderId, String reason);

    void cancelOrder(Long orderId);

    void scheduleDelivery(Long orderId, List<Truck> assignedTrucks);

    void fulfillOrder(Long orderId);

    List<Order> findAll();

    List<OrderDto> findByClient_Id(Long id);

    void createOrder(OrderDto orderDto);
}
