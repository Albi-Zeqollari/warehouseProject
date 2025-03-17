package com.example.warehouse.persistence.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trucks")
@Data
public class Truck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String chassisNumber;

    @Column(unique = true)
    private String licensePlate;

    @ManyToMany(mappedBy = "trucks")
    @JsonManagedReference
    private List<Delivery> deliveries;

}