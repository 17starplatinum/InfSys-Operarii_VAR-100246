package ru.ifmo.se.dto;

import ru.ifmo.se.entity.Address;
import ru.ifmo.se.entity.enumerated.OrganizationType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationDTO {
    private Long id;

    @NotNull
    private Address officialAddress;

    @NotNull
    @Min(1)
    private Float annualTurnover;

    @Min(1)
    private int employeesCount;

    @Size(min = 1, max = 1576)
    private String fullName;

    private OrganizationType type;

    @NotNull
    private Address postalAddress;
}
