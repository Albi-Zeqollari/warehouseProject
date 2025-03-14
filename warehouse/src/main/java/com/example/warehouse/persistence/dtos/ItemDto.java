package com.example.warehouse.persistence.dtos;

import com.example.warehouse.persistence.entity.Item;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemDto {

    private String name;
    private int quantity;
    private BigDecimal unitPrice;

    public Item toEntity() {
        Item item = new Item();
        item.setName(name);
        item.setQuantity(quantity);
        item.setUnitPrice((unitPrice));
        return item;
    }

    public static ItemDto fromEntity(Item item) {
        ItemDto itemDto = new ItemDto();
        itemDto.setName(item.getName());
        itemDto.setQuantity(item.getQuantity());
        itemDto.setUnitPrice(item.getUnitPrice());
        return itemDto;
    }

}
