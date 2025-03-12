package com.example.warehouse.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(unique = true)
    private String orderNumber;

    private LocalDateTime submittedDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private LocalDate deadlineDate;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @ManyToOne
    private User client;

    private String declineReason;
}