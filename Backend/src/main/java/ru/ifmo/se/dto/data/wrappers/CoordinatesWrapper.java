package ru.ifmo.se.dto.data.wrappers;

import ru.ifmo.se.entity.data.Coordinates;

import jakarta.validation.Valid;
import lombok.Data;

@Data
public class CoordinatesWrapper {
    private Long coordinatesId;
    @Valid
    private Coordinates coordinates;
}
