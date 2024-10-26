package ru.ifmo.se.util.filter;

import ru.ifmo.se.dto.WorkerDTO;
import ru.ifmo.se.dto.criteria.WorkerFilterCriteria;
import ru.ifmo.se.repository.entity.WorkerRepository;
import ru.ifmo.se.util.EntityMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WorkerFilterProcessor implements FilterProcessor<WorkerDTO, WorkerFilterCriteria> {

    private final WorkerRepository workerRepository;
    private final EntityMapper entityMapper;

    @Override
    public Page<WorkerDTO> filter(WorkerFilterCriteria criteria, Pageable pageable) {
        if((criteria.getName() == null || criteria.getName().isEmpty())
                && criteria.getPosition() == null
                && criteria.getStatus() == null) {
            return workerRepository.findAll(pageable).map(entityMapper::toWorkerDTO);
        } else {
            return workerRepository.findByFilters(criteria.getName(), criteria.getPosition(), criteria.getStatus(), pageable).map(entityMapper::toWorkerDTO);
        }
    }
}
