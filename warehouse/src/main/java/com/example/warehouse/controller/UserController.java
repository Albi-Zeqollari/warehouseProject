package com.example.warehouse.controller;


import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.User;
import com.example.warehouse.persistence.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/system-admin/users")
@CrossOrigin(origins = "http://localhost:4200")
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
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        userService.updateUser(user);
        log.info("User updated Successfully");
        return ResponseEntity.ok("User Updated Successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User Deleted Successfully");
    }

    @GetMapping("/currentUser")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        // If there is no valid Authentication, respond with 401
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authentication.getName();

        User user = userService.findByUsername(username);
        if (user == null) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

}
