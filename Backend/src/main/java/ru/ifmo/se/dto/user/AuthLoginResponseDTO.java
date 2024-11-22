package ru.ifmo.se.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthLoginResponseDTO {
    private String token;
    private long expiration;
}
