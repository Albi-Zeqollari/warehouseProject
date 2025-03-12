package com.example.warehouse.persistence.service.impl;

import com.example.warehouse.persistence.dtos.OrderDto;
import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.*;
import com.example.warehouse.persistence.repository.ItemRepository;
import com.example.warehouse.persistence.repository.OrderRepository;
import com.example.warehouse.persistence.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ItemRepository itemRepository) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
    }


    @Override
    @Transactional
    public OrderDto getOrder(String orderId) {
        return orderRepository.findById(orderId)
                .map(OrderDto::fromEntity)
                .orElse(null);
    }


    @Transactional
    @Override
    public void updateOrder(OrderDto orderDto) {
        orderRepository.save(orderDto.toEntity());
    }

    @Override
    @Transactional
    public void submitOrder(String orderId) {
        OrderDto orderDto = getOrder(orderId);
        if (orderDto == null) {
            log.error("Order not found");
        }
        if (orderDto.getStatus() == OrderStatus.CREATED || orderDto.getStatus() == OrderStatus.DECLINED) {
            orderDto.setStatus(OrderStatus.AWAITING_APPROVAL);
            orderDto.setSubmittedDate(LocalDateTime.now());
            orderRepository.save(orderDto.toEntity());
        }
    }

    @Override
    @Transactional
    public void approveOrder(String orderId) {
        OrderDto orderDto = getOrder(orderId);
        if (orderDto != null && orderDto.getStatus() == OrderStatus.AWAITING_APPROVAL) {
            orderDto.setStatus(OrderStatus.APPROVED);
            orderRepository.save(orderDto.toEntity());
        }
    }

    @Override
    @Transactional
    public void declineOrder(String orderId, String reason) {
        OrderDto orderDto = getOrder(orderId);
        if (orderDto != null && orderDto.getStatus() == OrderStatus.AWAITING_APPROVAL) {
            orderDto.setStatus(OrderStatus.DECLINED);
            orderDto.setDeclineReason(reason);
            orderRepository.save(orderDto.toEntity());
        }
    }

    @Override
    @Transactional
    public void cancelOrder(String orderId) {
        OrderDto orderDto = getOrder(orderId);
        if (orderDto != null &&
                orderDto.getStatus() != OrderStatus.FULFILLED &&
                orderDto.getStatus() != OrderStatus.UNDER_DELIVERY &&
                orderDto.getStatus() != OrderStatus.CANCELED) {
            orderDto.setStatus(OrderStatus.CANCELED);
            orderRepository.save(orderDto.toEntity());
        }
    }

    @Override
    @Transactional
    public void scheduleDelivery(String orderId, List<Truck> assignedTrucks) {
        OrderDto orderDto = getOrder(orderId);
        if (orderDto != null && orderDto.getStatus() == OrderStatus.APPROVED) {

            for (OrderItem oi : orderDto.getOrderItems()) {
                Item item = oi.getItem();
                if (item.getQuantity() < oi.getRequestedQuantity()) {
                    // Not enough inventory, handle accordingly
                    throw new RuntimeException("Not enough inventory for item: " + item.getName());
                }
                // Deduct from inventory
                item.setQuantity(item.getQuantity() - oi.getRequestedQuantity());
                itemRepository.save(item);
            }

            orderDto.setStatus(OrderStatus.UNDER_DELIVERY);
            orderRepository.save(orderDto.toEntity());
        }
    }

    @Override
    @Transactional
    public void fulfillOrder(String orderId) {
        OrderDto orderDto = getOrder(orderId);
        if (orderDto != null && orderDto.getStatus() == OrderStatus.UNDER_DELIVERY) {
            orderDto.setStatus(OrderStatus.FULFILLED);
            orderRepository.save(orderDto.toEntity());
        }
    }


    @Override
    @Transactional
    public List<OrderDto> findAll() {
        return orderRepository.findAll()
                .stream().map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<OrderDto> findByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status)
                .stream().map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    public void createOrder(UserDto client) {
        Order order = new Order();
        order.setStatus(OrderStatus.CREATED);
        order.setClient(client.toEntity());
        order.setOrderNumber(generateOrderNumber());
        orderRepository.save(order);
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
