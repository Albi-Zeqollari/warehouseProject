package com.example.warehouse.persistence.dtos;

import com.example.warehouse.persistence.entity.Order;
import com.example.warehouse.persistence.entity.OrderItem;
import com.example.warehouse.persistence.entity.OrderStatus;
import com.example.warehouse.persistence.entity.User;
import jakarta.transaction.Transactional;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {

    private String orderNumber;

    private LocalDateTime submittedDate;

    private String status;

    private LocalDate deadlineDate;

    private List<OrderItem> orderItems;

    private User client;

    private String declineReason;


    public static OrderDto fromEntity(Order order) {
        OrderDto dto = new OrderDto();
        dto.setOrderNumber(order.getOrderNumber());
        dto.setSubmittedDate(order.getSubmittedDate());
        dto.setStatus(order.getStatus());
        dto.setDeadlineDate(order.getDeadlineDate());
        dto.setOrderItems(order.getOrderItems());
        dto.setClient(order.getClient());
        dto.setDeclineReason(order.getDeclineReason());
        return dto;
    }

    public Order toEntity() {
        Order order = new Order();
        order.setOrderNumber(getOrderNumber());
        order.setSubmittedDate(getSubmittedDate());
        order.setStatus(String.valueOf(getStatus()));
        order.setDeadlineDate(getDeadlineDate());
        order.setOrderItems(getOrderItems());
        order.setClient(getClient());
        order.setDeclineReason(getDeclineReason());
        return order;
    }
}
