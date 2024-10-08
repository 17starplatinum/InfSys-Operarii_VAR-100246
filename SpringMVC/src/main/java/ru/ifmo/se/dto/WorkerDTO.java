package ru.ifmo.se.dto;

import ru.ifmo.se.entity.*;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WorkerDTO {
    @NotNull
    @NotBlank
    private String name;

    @Min(1)
    private Double salary;

    @Min(1)
    private int rating;

    @NotNull
    private LocalDateTime creationDate;

    @NotNull
    private Position position;

    @NotNull
    private Person person;

    @NotNull
    private User creator;

    @NotNull
    private Coordinates coordinates;

    private Status status;

    private Organization organization;
}
