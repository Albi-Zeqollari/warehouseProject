package com.example.warehouse.persistence.service.impl;

import com.example.warehouse.persistence.dtos.OrderDto;
import com.example.warehouse.persistence.dtos.OrderItemDto;
import com.example.warehouse.persistence.entity.Item;
import com.example.warehouse.persistence.entity.Order;
import com.example.warehouse.persistence.entity.OrderItem;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.repository.ItemRepository;
import com.example.warehouse.persistence.repository.OrderItemRepository;
import com.example.warehouse.persistence.repository.OrderRepository;
import com.example.warehouse.persistence.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ItemRepository itemRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
        this.orderItemRepository = orderItemRepository;
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
    public void updateOrder(Order orderDto) {
        orderRepository.updateOrderStatusById(orderDto.getStatus(), orderDto.getDeclineReason(), orderDto.getId());
    }

    @Transactional
    @Override
    public void updateOrderItem(Long orderId, List<OrderItemDto> orderItemDtos) {
        List<OrderItem> existingItems = orderItemRepository.findByOrderId(orderId);

        // 2. Create a set of item IDs from the payload
        Set<Long> payloadItemIds = orderItemDtos.stream()
                .map(dto -> dto.getItem().getId())
                .collect(Collectors.toSet());

        // 3. Remove items that are no longer in the payload
        for (OrderItem existing : existingItems) {
            log.debug("item id {}", existing.getItem().getId());
            log.debug("payloadItemId {}", payloadItemIds);
            if (!payloadItemIds.contains(existing.getItem().getId())) {
                log.debug("item id {} not in payloadItemIds", existing.getItem().getId());
                orderItemRepository.removeOrderItemById(orderId, existing.getItem().getId());
                log.debug("existing id deleted {}", existing.getItem().getId());
            }
        }

        for (OrderItemDto dto : orderItemDtos) {
            Long itemId = dto.getItem().getId();
            int requestedQuantity = dto.getRequestedQuantity();

            Optional<OrderItem> existingOpt = orderItemRepository.findByOrderIdAndItemId(orderId, itemId);
            if (existingOpt.isPresent()) {
                OrderItem existingItem = existingOpt.get();
                existingItem.setRequestedQuantity(requestedQuantity);
                orderItemRepository.save(existingItem);
            } else {
                OrderItem newItem = new OrderItem();
                newItem.setOrder(dto.getOrder());  // Ensure dto.getOrder().getId() equals orderId
                newItem.setItem(dto.getItem());
                newItem.setRequestedQuantity(requestedQuantity);
                orderItemRepository.save(newItem);
            }
        }
    }


    @Override
    @Transactional
    public void scheduleDelivery(Long orderId, List<Truck> assignedTrucks) {
        OrderDto orderDto = getOrder(orderId);
        if (orderDto != null && Objects.equals(orderDto.getStatus(), "APPROVED")) {

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

            orderDto.setStatus("UNDER_DELIVERY");
            orderRepository.save(orderDto.toEntity());
        }
    }

    @Override
    @Transactional
    public List<Order> findAll() {
        return orderRepository.findAll();

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

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setSubmittedDate(orderDto.getSubmittedDate());
        order.setDeadlineDate(orderDto.getDeadlineDate());
        order.setStatus(String.valueOf(orderDto.getStatus()));
        order.setDeclineReason(orderDto.getDeclineReason());
        order.setClient(orderDto.getClient());
        order.setId(orderDto.getId());

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
