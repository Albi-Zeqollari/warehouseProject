package com.example.warehouse.persistence.service;

import com.example.warehouse.persistence.dtos.UserDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {

    ResponseEntity<?> createUser(UserDto user);

    void updateUser(UserDto user);

    void deleteUser(String userId);

    List<UserDto> getAllUsers();

    UserDto findByUsername(String username);


}
