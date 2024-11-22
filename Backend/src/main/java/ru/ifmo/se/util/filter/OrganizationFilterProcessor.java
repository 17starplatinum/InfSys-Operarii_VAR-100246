package ru.ifmo.se.util.filter;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import ru.ifmo.se.dto.data.OrganizationDTO;
import ru.ifmo.se.dto.data.filter.OrganizationFilterCriteria;
import ru.ifmo.se.repository.data.OrganizationRepository;
import ru.ifmo.se.util.EntityMapper;

@Component
@RequiredArgsConstructor
public class OrganizationFilterProcessor implements FilterProcessor<OrganizationDTO, OrganizationFilterCriteria> {
    private final OrganizationRepository organizationRepository;
    private final EntityMapper entityMapper;

    @Override
    public Page<OrganizationDTO> filter(OrganizationFilterCriteria criteria, Pageable pageable) {
        if (criteria.getFullName() == null || criteria.getFullName().isEmpty()) {
            return organizationRepository.findAll(pageable).map(entityMapper::toOrganizationDTO);
        } else {
            return organizationRepository.findByFullNameContaining(criteria.getFullName(), pageable).map(entityMapper::toOrganizationDTO);
        }
    }
}
