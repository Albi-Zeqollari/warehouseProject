package com.example.warehouse.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "trucks")
@Data
public class Truck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(unique = true)
    private String chassisNumber;

    @Column(unique = true)
    private String licensePlate;

}