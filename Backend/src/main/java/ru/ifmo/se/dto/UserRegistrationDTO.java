package ru.ifmo.se.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class UserRegistrationDTO {
    @NotBlank
    @Size(min = 2)
    private String username;

    @NotBlank
    @Size(min = 8)
    private String password;
}
