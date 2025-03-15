package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    @Modifying
    @Query("UPDATE User u SET u.username = :username, u.role = :role WHERE u.id = :id")
    void updateUserById(@Param("username") String username,
                        @Param("role") String role,
                        @Param("id") Long id);
}
