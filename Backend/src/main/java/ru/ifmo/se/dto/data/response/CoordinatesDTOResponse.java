package ru.ifmo.se.dto.data.response;

import jakarta.validation.constraints.Max;
import lombok.Data;

@Data
public class CoordinatesDTOResponse {
    @Max(920)
    private Double x;

    @Max(27)
    private Integer y;
}
