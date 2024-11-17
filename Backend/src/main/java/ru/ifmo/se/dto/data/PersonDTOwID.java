package ru.ifmo.se.dto.data;

import jakarta.validation.Valid;
import ru.ifmo.se.dto.data.wrappers.LocationWrapper;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.ifmo.se.validators.ValidObject;

@Data
public class PersonDTOwID {
    private Long id;

    @NotNull
    private String eyeColor;

    private String hairColor;

    @ValidObject
    @Valid
    private LocationWrapper locationWrapper;

    private String birthday;

    @Min(1)
    @NotNull
    private Double weight;

    @NotNull
    private String nationality;
}
