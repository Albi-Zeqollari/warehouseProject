package com.example.warehouse.persistence.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "items")
@Data
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private String name;
    private int quantity;
    private double unitPrice;

}