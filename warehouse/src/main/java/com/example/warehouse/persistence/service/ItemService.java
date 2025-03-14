package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.dtos.ItemDto;
import com.example.warehouse.persistence.entity.Item;

import java.util.List;

public interface ItemService {

    void createItem(ItemDto item);

    List<ItemDto> getAllItems();

    void updateItem(ItemDto item);

    void deleteItem(Long id);
}
