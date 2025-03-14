package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {

    ResponseEntity<?> createUser(UserDto user);

    void updateUser(UserDto user);

    void deleteUser(Long userId);

    List<UserDto> getAllUsers();

    User findByUsername(String username);


}
