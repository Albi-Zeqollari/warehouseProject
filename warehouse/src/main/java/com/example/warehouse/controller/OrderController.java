package com.example.warehouse.controller;


import com.example.warehouse.persistence.dtos.OrderDto;
import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.OrderItem;
import com.example.warehouse.persistence.entity.OrderStatus;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.entity.User;
import com.example.warehouse.persistence.service.OrderService;
import com.example.warehouse.persistence.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {


    private final OrderService orderService;

    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/client/orders")
    public void createOrder(@RequestParam String username) {
        UserDto client = userService.findByUsername(username);
        orderService.createOrder(client);
    }

    @PutMapping("/client/orders/{orderId}/addItem")
    public OrderDto addItemToOrder(@PathVariable String orderId, @RequestBody OrderItem orderItem) {
        OrderDto orderDto = orderService.getOrder(orderId);
        if (orderDto != null && (orderDto.getStatus() == OrderStatus.CREATED || orderDto.getStatus() == OrderStatus.DECLINED)) {
            orderDto.getOrderItems().add(orderItem);
            orderService.updateOrder(orderDto);
        }
        return orderDto;
    }

    @PutMapping("/client/orders/{orderId}/removeItem/{orderItemId}")
    public void removeItemFromOrder(@PathVariable String orderId, @PathVariable String orderItemId) {
        OrderDto orderDto = orderService.getOrder(orderId);
        if (orderDto != null && (orderDto.getStatus() == OrderStatus.CREATED || orderDto.getStatus() == OrderStatus.DECLINED)) {
            orderDto.getOrderItems().removeIf(item -> item.getId().equals(orderItemId));
            orderService.updateOrder(orderDto);
        }
    }

    @PutMapping("/client/orders/{orderId}/cancel")
    public void cancelOrder(@PathVariable String orderId) {
        orderService.cancelOrder(orderId);
    }

    @PutMapping("/client/orders/{orderId}/submit")
    public void submitOrder(@PathVariable String orderId) {
        orderService.submitOrder(orderId);
    }

    @GetMapping("/client/orders")
    public List<OrderDto> viewMyOrders(@RequestParam(required = false) OrderStatus status,
                                       @RequestParam String username) {
        if (status != null) {
            return orderService.findByStatus(status);
        } else {
            return orderService.findAll();
        }
    }


    @GetMapping("/manager/orders")
    public List<OrderDto> getAllOrdersForManager(@RequestParam(required = false) OrderStatus status) {
        // Filter by status or return all
        if (status != null) {
            return orderService.findByStatus(status);
        } else {
            return orderService.findAll();
        }
    }

    @GetMapping("/manager/orders/{orderId}")
    public OrderDto getOrderDetail(@PathVariable String orderId) {
        return orderService.getOrder(orderId);
    }

    @PutMapping("/manager/orders/{orderId}/approve")
    public void approveOrder(@PathVariable String orderId) {
        orderService.approveOrder(orderId);
    }

    @PutMapping("/manager/orders/{orderId}/decline")
    public void declineOrder(@PathVariable String orderId, @RequestBody String reason) {
        orderService.declineOrder(orderId, reason);
    }

    @PutMapping("/manager/orders/{orderId}/scheduleDelivery")
    public void scheduleDelivery(@PathVariable String orderId, @RequestBody List<Truck> trucks) {
        orderService.scheduleDelivery(orderId, trucks);
    }

    @PutMapping("/manager/orders/{orderId}/fulfill")
    public void fulfillOrder(@PathVariable String orderId) {
        orderService.fulfillOrder(orderId);
    }
}
