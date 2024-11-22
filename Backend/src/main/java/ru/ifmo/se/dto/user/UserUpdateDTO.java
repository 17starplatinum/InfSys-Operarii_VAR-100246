package ru.ifmo.se.dto.user;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {
    @Size(min = 1)
    private String username;

    @Size(min = 8)
    private String password;
}
