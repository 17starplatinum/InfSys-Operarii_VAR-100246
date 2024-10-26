package ru.ifmo.se.dto.criteria;

import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationFilterCriteria {
    private String fullName;
}
