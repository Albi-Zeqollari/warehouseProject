package com.example.warehouse.persistence.dtos;

import com.example.warehouse.persistence.entity.Item;
import com.example.warehouse.persistence.entity.OrderItem;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class OrderItemDto {

    private Item item;

    private int requestedQuantity;


    public static OrderItem toEntity(OrderItem orderItem) {
        OrderItem orderItemDto = new OrderItem();
        orderItemDto.setItem(orderItem.getItem());
        orderItemDto.setRequestedQuantity(orderItem.getRequestedQuantity());
        return orderItemDto;
    }

}
