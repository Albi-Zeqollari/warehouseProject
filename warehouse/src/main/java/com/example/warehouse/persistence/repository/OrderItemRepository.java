package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId AND oi.item.id = :itemId")
    Optional<OrderItem> findByOrderIdAndItemId(
            @Param("orderId") Long orderId,
            @Param("itemId") Long itemId
    );

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);

    @Modifying
    @Query("DELETE FROM OrderItem oi WHERE oi.order.id = :orderId and oi.item.id = :itemId")
    void removeOrderItemById(@Param("orderId") Long orderId,@Param("itemId") Long itemId);

}
