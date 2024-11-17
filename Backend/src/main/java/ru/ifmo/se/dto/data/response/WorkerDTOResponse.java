package ru.ifmo.se.dto.data.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WorkerDTOResponse {
    private long id;
    private String name;
    private Double salary;
    private int rating;
    private LocalDateTime creationDate;
    private String position;
    private PersonDTOResponse person;
    private String creatorUsername;
    private CoordinatesDTOResponse coordinates;
    private String status;
    private OrganizationDTOResponse organization;
}
