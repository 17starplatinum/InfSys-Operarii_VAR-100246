package ru.ifmo.se.dto.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.data.enumerated.Position;
import ru.ifmo.se.entity.data.enumerated.Status;
import ru.ifmo.se.entity.user.User;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerDTO {
    private Long id;
    @NotNull
    @NotBlank
    private String name;

    @Positive
    private Double salary;

    @Positive
    private int rating;

    @NotNull
    private LocalDateTime creationDate;

    @NotNull
    private Position position;

    @NotNull
    private PersonDTO person;

    @NotNull
    private CoordinatesDTO coordinates;

    private Status status;

    private OrganizationDTO organization;

    private User createdBy;
}
