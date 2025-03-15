package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface ItemRepository  extends JpaRepository<Item, Long> {


    @Modifying
    @Query("UPDATE Item u SET u.name = :name, u.quantity = :quantity , u.unitPrice = :unitPrice WHERE u.id = :id")
    void updateItemById(@Param("name") String name,
                        @Param("quantity") int quantity,
                        @Param("unitPrice") BigDecimal unitPrice,
                        @Param("id") Long id);


}
