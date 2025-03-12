package com.example.warehouse.controller;


import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.User;
import com.example.warehouse.persistence.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/system-admin/users")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDto user) {
         userService.createUser(user);
         return ResponseEntity.ok("User created Successfully");
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User user) {
        user.setId(id);
         userService.updateUser(UserDto.fromEntity(user));
         return ResponseEntity.ok("User Updated Successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User Deleted Successfully");
    }

}
