package ru.ifmo.se.dto.data;

import jakarta.validation.constraints.Max;
import lombok.Data;

@Data
public class CoordinatesDTOwID {
    private Long id;

    @Max(920)
    private Double x;

    @Max(27)
    private Integer y;
}
