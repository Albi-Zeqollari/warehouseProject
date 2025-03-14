package com.example.warehouse.persistence.repository;

import com.example.warehouse.persistence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository  extends JpaRepository<User, Long> {

    User findByUsername(String username);
}
