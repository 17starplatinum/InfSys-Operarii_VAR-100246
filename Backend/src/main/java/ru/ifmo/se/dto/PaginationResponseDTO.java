package ru.ifmo.se.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PaginationResponseDTO {
    private List<?> content;

    private int currentPage;

    private long totalItems;

    private int totalPages;
}
