package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.Order;
import com.example.warehouse.persistence.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByClient_Id(Long id);


}


