package ru.ifmo.se.dto.data.wrappers;

import ru.ifmo.se.entity.data.Organization;

import jakarta.validation.Valid;
import lombok.Data;

@Data
public class OrganizationWrapper {
    private Long organizationId;
    @Valid
    private Organization organization;
}
