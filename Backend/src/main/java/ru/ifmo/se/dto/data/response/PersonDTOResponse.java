package ru.ifmo.se.dto.data.response;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PersonDTOResponse {
    @NotNull
    private String eyeColor;

    private String hairColor;

    @NotNull
    private LocationDTOResponse location;

    private String birthday;

    @Min(1)
    @NotNull
    private Double weight;

    @NotNull
    private String nationality;
}
