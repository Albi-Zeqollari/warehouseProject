package com.example.warehouse.controller;


import com.example.warehouse.persistence.dtos.ItemDto;
import com.example.warehouse.persistence.entity.Item;
import com.example.warehouse.persistence.service.ItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager/items")
@CrossOrigin(origins = "http://localhost:4200")
public class ItemController {


    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    public void createItem(@RequestBody ItemDto itemDto) {
         itemService.createItem(itemDto);
    }

    @GetMapping
    public List<ItemDto> getAllItems() {
        return itemService.getAllItems();
    }

    @PutMapping("/{itemId}")
    public void updateItem(@PathVariable Long itemId, @RequestBody Item item) {
        item.setId(itemId);
         itemService.updateItem(ItemDto.fromEntity(item));
    }

    @DeleteMapping("/{itemId}")
    public void deleteItem(@PathVariable Long itemId) {
        itemService.deleteItem(itemId);
    }
}
