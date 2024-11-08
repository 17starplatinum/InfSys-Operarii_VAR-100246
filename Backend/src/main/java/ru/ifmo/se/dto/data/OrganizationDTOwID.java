package ru.ifmo.se.dto.data;

import ru.ifmo.se.dto.data.wrappers.AddressWrapper;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import lombok.Data;
import ru.ifmo.se.validators.ValidObject;

@Data
public class OrganizationDTOwID {
    private Long id;

    @ValidObject
    @Valid
    private AddressWrapper officialAddressWrapper;

    @NotNull
    @Min(1)
    private Float annualTurnover;

    @Min(1)
    private int employeesCount;

    @Size(min = 1, max = 1576)
    private String fullName;

    private String type;

    @ValidObject
    @Valid
    private AddressWrapper postalAddressWrapper;
}
