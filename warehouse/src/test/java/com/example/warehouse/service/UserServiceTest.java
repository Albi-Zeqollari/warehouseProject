package com.example.warehouse.service;

import com.example.warehouse.persistence.dtos.UserDto;
import com.example.warehouse.persistence.entity.User;
import com.example.warehouse.persistence.repository.UserRepository;
import com.example.warehouse.persistence.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void testCreateUser_Success() {

        UserDto userDto = new UserDto();
        userDto.setUsername("testuser");
        userDto.setPassword("plainPassword");
        userDto.setRole("CLIENT");

        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = userService.createUser(userDto);

        assertEquals("User created Successfully", response.getBody());
        assertEquals(200, response.getStatusCodeValue());

        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testUpdateUser() {
        User userDto = new User();
        userDto.setId(1L);
        userDto.setUsername("testuser");
        userDto.setRole("CLIENT");

        userService.updateUser(userDto);

        verify(userRepository, times(1))
                .updateUserById("testuser", "CLIENT", 1L);
    }

    @Test
    void testGetAllUsers() {

        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("alice");

        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("bob");

        List<User> mockUsers = Arrays.asList(user1, user2);
        when(userRepository.findAll()).thenReturn(mockUsers);


        List<User> result = userService.getAllUsers();


        assertEquals(2, result.size());
        assertEquals("alice", result.get(0).getUsername());
        assertEquals("bob", result.get(1).getUsername());


        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testFindByUsername() {
        // Arrange
        String username = "john";
        User mockUser = new User();
        mockUser.setUsername(username);
        when(userRepository.findByUsername(username)).thenReturn(mockUser);
        User result = userService.findByUsername(username);
        assertEquals(username, result.getUsername());

        verify(userRepository, times(1)).findByUsername(username);
    }
}
