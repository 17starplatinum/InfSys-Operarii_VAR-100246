package ru.ifmo.se.dto.data;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationDTOwID {
    private Long id;
    @NotNull
    private Float x;

    private long y;

    @NotNull
    private Long z;
}
