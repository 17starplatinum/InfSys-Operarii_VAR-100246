package ru.ifmo.se.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginDTO {
    @NotBlank(message = "Username cannot be empty.")
    private String username;

    @NotBlank(message = "Password cannot be empty.")
    private String password;
}