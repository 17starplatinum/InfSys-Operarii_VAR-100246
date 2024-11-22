package ru.ifmo.se.dto.data.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.data.enumerated.OrganizationType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationFilterCriteria {
    private String fullName;
    private OrganizationType type;
}
