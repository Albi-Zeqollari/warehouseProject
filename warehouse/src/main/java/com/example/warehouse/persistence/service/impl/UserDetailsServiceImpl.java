package com.example.warehouse.persistence.service.impl;

import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.User;
import com.example.warehouse.persistence.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        UserDto user = UserDto.fromEntity(userRepository.findByUsername(username));
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singleton(() -> "ROLE_" + user.getRole())
        );
    }
}
