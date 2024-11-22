package ru.ifmo.se.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.data.enumerated.AdminRequestStatus;
import ru.ifmo.se.entity.data.enumerated.UserRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;

    @NotBlank
    private String username;

    @NotNull
    private UserRole role;

    private AdminRequestStatus adminRequestStatus;
}
