package com.example.warehouse.persistence.service.impl;

import com.example.warehouse.persistence.dtos.ItemDto;
import com.example.warehouse.persistence.entity.Item;
import com.example.warehouse.persistence.repository.ItemRepository;
import com.example.warehouse.persistence.service.ItemService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    public ItemServiceImpl(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }


    @Transactional
    public void createItem(ItemDto itemDto) {
        itemRepository.save(itemDto.toEntity());
    }

    @Override
    @Transactional
    public List<Item> getAllItems() {
        return new ArrayList<>(itemRepository.findAll());
    }


    @Transactional
    public void updateItem(Item item) {
         itemRepository.updateItemById(item.getName(), item.getQuantity(), item.getUnitPrice());
    }

    @Override
    @Transactional
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }
}
