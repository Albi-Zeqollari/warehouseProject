package com.example.warehouse.persistence.service.impl;

import com.example.warehouse.persistence.dtos.ItemDto;
import com.example.warehouse.persistence.entity.Item;
import com.example.warehouse.persistence.repository.ItemRepository;
import com.example.warehouse.persistence.service.ItemService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
    public List<ItemDto> getAllItems() {
        return itemRepository
                .findAll()
                .stream()
                .map(ItemDto::fromEntity)
                .collect(Collectors.toList());
    }


    @Transactional
    public void updateItem(ItemDto itemDto) {
         itemRepository.save(itemDto.toEntity());
    }

    @Override
    @Transactional
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }
}
