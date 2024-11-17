package ru.ifmo.se.dto.data;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.ifmo.se.dto.data.wrappers.LocationWrapper;
import ru.ifmo.se.validators.ValidObject;


@Data
public class AddressDTOwID {
    private Long id;

    @NotNull
    private String zipCode;

    @ValidObject
    @Valid
    private LocationWrapper locationWrapper;
}
