package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.Order;
import com.example.warehouse.persistence.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Modifying
    @Query("UPDATE Order u SET u.status = :status  WHERE u.id = :id")
    void updateOrderStatusById(@Param("status") String status,
                               @Param("id") Long id);


    List<Order> findByClient_Id(Long id);


}


