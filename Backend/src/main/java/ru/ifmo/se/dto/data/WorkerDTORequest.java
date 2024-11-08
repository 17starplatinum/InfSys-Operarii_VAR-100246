package ru.ifmo.se.dto.data;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import ru.ifmo.se.dto.data.wrappers.CoordinatesWrapper;
import ru.ifmo.se.dto.data.wrappers.OrganizationWrapper;
import ru.ifmo.se.dto.data.wrappers.PersonWrapper;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.validators.ValidObject;

import java.time.LocalDateTime;

@Data
public class WorkerDTORequest {
    @NotNull
    @NotBlank
    private String name;

    @Min(1)
    private Double salary;

    @Min(1)
    private int rating;

    @NotNull
    private String creationDate;

    @NotNull
    private String position;

    @ValidObject
    @Valid
    private PersonWrapper personWrapper;

    @ValidObject
    @Valid
    private CoordinatesWrapper coordinatesWrapper;

    private String status;

    @ValidObject
    @Valid
    private OrganizationWrapper organizationWrapper;
}
