package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.dtos.OrderDto;
import com.example.warehouse.persistence.dtos.OrderItemDto;
import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.*;

import java.util.List;

public interface OrderService {

    OrderDto getOrder(Long orderId);

    void updateOrder(Order orderDto);

    void scheduleDelivery(Long orderId, List<Truck> assignedTrucks);

    void updateOrderItem(Long orderId,List<OrderItemDto> order);

    List<Order> findAll();

    List<OrderDto> findByClient_Id(Long id);

    void createOrder(OrderDto orderDto);
}
