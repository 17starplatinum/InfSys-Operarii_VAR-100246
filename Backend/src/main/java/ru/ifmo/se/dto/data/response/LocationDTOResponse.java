package ru.ifmo.se.dto.data.response;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationDTOResponse {
    @NotNull
    private Float x;

    private long y;

    @NotNull
    private Long z;
}
