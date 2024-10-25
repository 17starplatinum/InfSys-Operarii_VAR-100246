package ru.ifmo.se.dto;

import jakarta.validation.constraints.Max;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatesDTO {
    private Long id;

    @Max(920)
    private Double x;

    @Max(27)
    private Integer y;
}
