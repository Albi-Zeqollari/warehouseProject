package com.example.warehouse.persistence.dtos;

import com.example.warehouse.persistence.entity.Item;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class OrderItemDto {

    private Item item;

    private int requestedQuantity;

}
