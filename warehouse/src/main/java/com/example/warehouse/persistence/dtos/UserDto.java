package com.example.warehouse.persistence.dtos;

import com.example.warehouse.persistence.entity.Role;
import com.example.warehouse.persistence.entity.User;
import lombok.Data;

@Data
public class UserDto {


    private String username;

    private String password;

    private Role role;

    public User toEntity() {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setRole(role);
        return user;
    }

    public static UserDto fromEntity(User user) {
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setPassword(user.getPassword());
        userDto.setRole(user.getRole());
        return userDto;
    }

}
