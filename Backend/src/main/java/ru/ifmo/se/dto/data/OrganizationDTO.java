package ru.ifmo.se.dto.data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
    @Positive
    private Float annualTurnover;

    @Positive
    private int employeesCount;

    @Size(min = 1, max = 1576)
    private String fullName;

    private OrganizationType organizationType;

    @NotNull
    private AddressDTO postalAddress;

    private User createdBy;
}
