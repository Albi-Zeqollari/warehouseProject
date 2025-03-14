package com.example.warehouse.persistence.service.impl;

import com.example.warehouse.persistence.dtos.OrderDto;
import com.example.warehouse.persistence.entity.*;
import com.example.warehouse.persistence.repository.ItemRepository;
import com.example.warehouse.persistence.repository.OrderRepository;
import com.example.warehouse.persistence.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public OrderDto getOrder(Long orderId) {
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
    public void submitOrder(Long orderId) {
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
    public void approveOrder(Long orderId) {
        OrderDto orderDto = getOrder(orderId);
        if (orderDto != null && orderDto.getStatus() == OrderStatus.AWAITING_APPROVAL) {
            orderDto.setStatus(OrderStatus.APPROVED);
            orderRepository.save(orderDto.toEntity());
        }
    }

    @Override
    @Transactional
    public void declineOrder(Long orderId, String reason) {
        OrderDto orderDto = getOrder(orderId);
        if (orderDto != null && orderDto.getStatus() == OrderStatus.AWAITING_APPROVAL) {
            orderDto.setStatus(OrderStatus.DECLINED);
            orderDto.setDeclineReason(reason);
            orderRepository.save(orderDto.toEntity());
        }
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
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
    public void scheduleDelivery(Long orderId, List<Truck> assignedTrucks) {
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
    public void fulfillOrder(Long orderId) {
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

    @Override
    @Transactional
    public List<OrderDto> findByClient_Id(Long id) {
        return orderRepository.findByClient_Id(id)
                .stream().map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }


    @Transactional
    @Override
    public void createOrder(OrderDto orderDto) {

        // Build the Order entity.
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setSubmittedDate(orderDto.getSubmittedDate());
        order.setDeadlineDate(orderDto.getDeadlineDate());
        order.setStatus(String.valueOf(orderDto.getStatus()));
        order.setDeclineReason(orderDto.getDeclineReason());
        order.setClient(orderDto.getClient());

        // Process each order item.
        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItem orderItemDto : orderDto.getOrderItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setItem(orderItemDto.getItem());
            orderItem.setRequestedQuantity(orderItemDto.getRequestedQuantity());
            orderItem.setOrder(order);
            orderItems.add(orderItem);
        }
        order.setOrderItems(orderItems);

        orderRepository.save(order);
    }


    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
