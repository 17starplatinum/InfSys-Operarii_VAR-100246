package ru.ifmo.se.util.filter;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import ru.ifmo.se.dto.data.WorkerDTO;
import ru.ifmo.se.dto.data.filter.WorkerFilterCriteria;
import ru.ifmo.se.repository.data.WorkerRepository;
import ru.ifmo.se.util.EntityMapper;

@Component
@RequiredArgsConstructor
public class WorkerFilterProcessor implements FilterProcessor<WorkerDTO, WorkerFilterCriteria> {
    private final WorkerRepository workerRepository;
    private final EntityMapper entityMapper;

    @Override
    public Page<WorkerDTO> filter(WorkerFilterCriteria criteria, Pageable pageable) {
        if((criteria.getName() == null || criteria.getName().isEmpty()) && (criteria.getOrganizationName() == null || criteria.getOrganizationName().isEmpty())) {
            return workerRepository.findAll(pageable).map(entityMapper::toWorkerDTO);
        } else {
            return workerRepository.findByFilters(criteria.getName(), criteria.getOrganizationName(), pageable).map(entityMapper::toWorkerDTO);
        }
    }
}
