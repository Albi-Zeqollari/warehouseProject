package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.dtos.OrderDto;
import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.Order;
import com.example.warehouse.persistence.entity.OrderStatus;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.entity.User;
import jakarta.transaction.Transactional;

import java.util.List;

public interface OrderService {

    OrderDto getOrder(String orderId);

    void updateOrder(OrderDto orderDto);

    void submitOrder(String orderId);

    void approveOrder(String orderId);

    void declineOrder(String orderId, String reason);

    void cancelOrder(String orderId);

    void scheduleDelivery(String orderId, List<Truck> assignedTrucks);

    void fulfillOrder(String orderId);

    List<OrderDto> findAll();

    List<OrderDto> findByStatus(OrderStatus status);

    void createOrder(UserDto client);
}
