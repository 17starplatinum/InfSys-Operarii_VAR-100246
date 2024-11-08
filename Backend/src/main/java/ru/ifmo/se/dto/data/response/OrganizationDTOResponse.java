package ru.ifmo.se.dto.data.response;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrganizationDTOResponse {
    @NotNull
    private AddressDTOResponse officialAddress;

    @NotNull
    @Min(1)
    private Float annualTurnover;

    @Min(1)
    private int employeesCount;

    @Size(min = 1, max = 1576)
    private String fullName;

    private String type;

    @NotNull
    private AddressDTOResponse postalAddress;
}
