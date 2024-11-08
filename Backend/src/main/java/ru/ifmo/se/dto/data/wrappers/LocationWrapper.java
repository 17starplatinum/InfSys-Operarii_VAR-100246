package ru.ifmo.se.dto.data.wrappers;

import lombok.AllArgsConstructor;
import ru.ifmo.se.entity.data.Location;

import jakarta.validation.Valid;
import lombok.Data;

@Data
@AllArgsConstructor
public class LocationWrapper {
    private Long locationId;
    @Valid
    private Location location;
}
