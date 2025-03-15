package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.dtos.ItemDto;
import com.example.warehouse.persistence.entity.Item;

import java.util.List;

public interface ItemService {

    void createItem(ItemDto item);

    List<Item> getAllItems();

    void updateItem(Item itemDto);

    void deleteItem(Long id);
}
