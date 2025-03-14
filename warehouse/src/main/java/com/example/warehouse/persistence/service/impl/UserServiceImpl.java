package com.example.warehouse.persistence.service.impl;


import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.Role;
import com.example.warehouse.persistence.entity.User;
import com.example.warehouse.persistence.repository.UserRepository;
import com.example.warehouse.persistence.service.UserService;
import com.example.warehouse.utils.JwtUtils;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Transactional
    @Override
    public ResponseEntity<?> createUser(UserDto user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setUsername(user.getUsername());
        user.setRole(user.getRole());
        userRepository.save(user.toEntity());
        return ResponseEntity.ok("User created Successfully");
    }

    @Override
    @Transactional
    public void updateUser(UserDto user) {
        userRepository.save(user.toEntity());
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
