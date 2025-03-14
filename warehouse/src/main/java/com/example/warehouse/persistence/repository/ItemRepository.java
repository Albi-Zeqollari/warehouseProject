package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository  extends JpaRepository<Item, Long> {
}
