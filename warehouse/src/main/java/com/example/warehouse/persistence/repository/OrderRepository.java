package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.Order;
import com.example.warehouse.persistence.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Modifying
    @Query("UPDATE Order u " +
            "SET u.status = :status, " +
            "    u.declineReason = :declineReason " +
            "WHERE u.id = :id")
    void updateOrderStatusById(@Param("status") String status,
                               @Param("declineReason") String declineReason,
                               @Param("id") Long id);

    List<Order> findByClient_Id(Long id);


}


