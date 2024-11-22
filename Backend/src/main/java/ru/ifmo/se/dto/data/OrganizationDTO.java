package ru.ifmo.se.dto.data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.data.enumerated.OrganizationType;
import ru.ifmo.se.entity.user.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationDTO {
    private Long id;

    @NotNull
    private AddressDTO officialAddress;

    @NotNull
    @Min(1)
    private Float annualTurnover;

    @Min(1)
    private int employeesCount;

    @Size(min = 1, max = 1576)
    private String fullName;

    private OrganizationType type;
    @NotNull
    private AddressDTO postalAddress;

    private User createdBy;
}
