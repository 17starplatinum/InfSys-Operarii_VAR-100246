package ru.ifmo.se.dto.admin;

import lombok.Data;

import java.util.List;

@Data
public class AdminRequestDTO {
    private Long id;
    private String requesterUsername;
    private boolean approvedByAll;
    private List<String> approvedByUsernames;
}
