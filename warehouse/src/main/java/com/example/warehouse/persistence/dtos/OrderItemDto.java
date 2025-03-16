package com.example.warehouse.persistence.dtos;

import com.example.warehouse.persistence.entity.Item;
import com.example.warehouse.persistence.entity.Order;
import com.example.warehouse.persistence.entity.OrderItem;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.util.List;

@Data
public class OrderItemDto {

    private Item item;

    private int requestedQuantity;

    private  Order order;

    public  OrderItem toEntity(OrderItem orderItem) {
        OrderItem orderItemDto = new OrderItem();
        orderItemDto.setItem(orderItem.getItem());
        orderItemDto.setRequestedQuantity(orderItem.getRequestedQuantity());
        orderItemDto.setOrder(orderItem.getOrder());
        return orderItemDto;
    }

    public  static  OrderItemDto fromEntity(OrderItem order) {
        OrderItemDto orderItemDto = new OrderItemDto();
        orderItemDto.setOrder(order.getOrder());
        orderItemDto.setRequestedQuantity(order.getRequestedQuantity());
        orderItemDto.setItem(order.getItem());
        return orderItemDto;

    }

}
