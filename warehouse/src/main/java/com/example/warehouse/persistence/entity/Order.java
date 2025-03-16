package com.example.warehouse.persistence.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 50)
    private String orderNumber;

    @Column(name = "submitted_date")
    private LocalDateTime submittedDate;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "CREATED";

    @Column(name = "deadline_date")
    private LocalDate deadlineDate;

    @Column(name = "decline_reason", columnDefinition = "TEXT")
    private String declineReason;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id")
    private User client;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<OrderItem> orderItems = new ArrayList<>();

}
