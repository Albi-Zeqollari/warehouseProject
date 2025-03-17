package com.example.warehouse.service;

import com.example.warehouse.persistence.dtos.ItemDto;
import com.example.warehouse.persistence.entity.Item;
import com.example.warehouse.persistence.repository.ItemRepository;
import com.example.warehouse.persistence.service.impl.ItemServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemServiceImpl itemService;

    @Test
    void testCreateItem() {
        ItemDto itemDto = new ItemDto();
        itemDto.setName("Test Item");
        itemDto.setQuantity(10);
        itemDto.setUnitPrice(BigDecimal.valueOf(5.0));

        when(itemRepository.save(any(Item.class))).thenAnswer(invocation -> invocation.getArgument(0));

        itemService.createItem(itemDto);

        verify(itemRepository, times(1)).save(argThat((Item i) ->
                i.getName().equals("Test Item") &&
                        i.getQuantity() == 10 &&
                        Objects.equals(i.getUnitPrice(), BigDecimal.valueOf(5.0))
        ));
    }

    @Test
    void testGetAllItems() {
        // Arrange
        Item item1 = new Item();
        item1.setId(1L);
        item1.setName("Item 1");
        item1.setQuantity(5);
        item1.setUnitPrice(BigDecimal.valueOf(2.5));

        Item item2 = new Item();
        item2.setId(2L);
        item2.setName("Item 2");
        item2.setQuantity(8);
        item2.setUnitPrice(BigDecimal.valueOf(3.0));

        when(itemRepository.findAll()).thenReturn(Arrays.asList(item1, item2));

        List<Item> result = itemService.getAllItems();

        assertEquals(2, result.size());
        assertEquals("Item 1", result.get(0).getName());
        assertEquals("Item 2", result.get(1).getName());
        verify(itemRepository, times(1)).findAll();
    }

    @Test
    void testUpdateItem() {
        // Arrange
        Item item = new Item();
        item.setId(1L);
        item.setName("Updated Item");
        item.setQuantity(15);
        item.setUnitPrice(BigDecimal.valueOf(10.0));

        itemService.updateItem(item);

        verify(itemRepository, times(1))
                .updateItemById("Updated Item", 15, BigDecimal.valueOf(10.0), 1L);
    }

    @Test
    void testDeleteItem() {
        Long itemId = 99L;

        itemService.deleteItem(itemId);

        verify(itemRepository, times(1)).deleteById(itemId);
    }
}
