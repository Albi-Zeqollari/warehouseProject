package com.example.warehouse.controller;


import com.example.warehouse.persistence.dtos.OrderDto;
import com.example.warehouse.persistence.dtos.OrderItemDto;
import com.example.warehouse.persistence.entity.Order;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PutMapping("/order/updateStatus")
    public ResponseEntity<Void> updateOrder(@RequestBody Order orderDto) {
        orderService.updateOrder(orderDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/order/updateOrderItems/{id}")
    public ResponseEntity<Void> updateOrder(@PathVariable Long id,@RequestBody List<OrderItemDto> orderDto) {
        orderService.updateOrderItem(id,orderDto);
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

    @PutMapping("/manager/orders/{orderId}/scheduleDelivery")
    public ResponseEntity<Void> scheduleDelivery(@PathVariable Long orderId, @RequestBody List<Truck> trucks) {
        orderService.scheduleDelivery(orderId, trucks);
        return ResponseEntity.ok().build();
    }

}
