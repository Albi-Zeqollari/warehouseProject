package com.example.warehouse.controller;


import com.example.warehouse.persistence.dtos.OrderDto;
import com.example.warehouse.persistence.entity.Order;
import com.example.warehouse.persistence.entity.OrderItem;
import com.example.warehouse.persistence.entity.OrderStatus;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.service.OrderService;
import com.example.warehouse.persistence.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {


    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create/orders")
    public ResponseEntity<Void> createOrder(@RequestBody OrderDto orderDto) {
        orderService.createOrder(orderDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/client/orders/{orderId}/addItem")
    public OrderDto addItemToOrder(@PathVariable Long orderId, @RequestBody OrderItem orderItem) {
        OrderDto orderDto = orderService.getOrder(orderId);
        if (orderDto != null && (Objects.equals(orderDto.getStatus(), "CREATED") || Objects.equals(orderDto.getStatus(), "DECLINED"))) {
            orderDto.getOrderItems().add(orderItem);
            orderService.updateOrder(orderDto);
        }
        return orderDto;
    }

    @PutMapping("/client/orders/{orderId}/removeItem/{orderItemId}")
    public void removeItemFromOrder(@PathVariable Long orderId, @PathVariable String orderItemId) {
        OrderDto orderDto = orderService.getOrder(orderId);
        if (orderDto != null && (Objects.equals(orderDto.getStatus(), "CREATED") || Objects.equals(orderDto.getStatus(), "DECLINED"))) {
            orderDto.getOrderItems().removeIf(item -> false);
            orderService.updateOrder(orderDto);
        }
    }

    @PutMapping("/client/orders/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/client/orders/{orderId}/submit")
    public ResponseEntity<Void> submitOrder(@PathVariable Long orderId) {
        orderService.submitOrder(orderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/client/my-orders/{id}")
    public ResponseEntity<List<OrderDto>> viewMyOrders(@PathVariable Long id) {
        List<OrderDto> orders = orderService.findByClient_Id(id);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/manager/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.findAll();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/manager/orders/{orderId}")
    public ResponseEntity<OrderDto> getOrderDetail(@PathVariable Long orderId) {
        OrderDto orderDto = orderService.getOrder(orderId);
        if (orderDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orderDto);
    }


    @PutMapping("/manager/orders/{orderId}/approve")
    public ResponseEntity<Void> approveOrder(@PathVariable Long orderId) {
        orderService.approveOrder(orderId);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/manager/orders/{orderId}/decline")
    public ResponseEntity<Void> declineOrder(@PathVariable Long orderId, @RequestBody String reason) {
        orderService.declineOrder(orderId, reason);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/manager/orders/{orderId}/scheduleDelivery")
    public ResponseEntity<Void> scheduleDelivery(@PathVariable Long orderId, @RequestBody List<Truck> trucks) {
        orderService.scheduleDelivery(orderId, trucks);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/manager/orders/{orderId}/fulfill")
    public ResponseEntity<Void> fulfillOrder(@PathVariable Long orderId) {
        orderService.fulfillOrder(orderId);
        return ResponseEntity.ok().build();
    }
}
