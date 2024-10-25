package ru.ifmo.se.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationDTO {
    private Long id;
    @NotNull
    private Float x;

    private long y;

    @NotNull
    private Long z;
}
