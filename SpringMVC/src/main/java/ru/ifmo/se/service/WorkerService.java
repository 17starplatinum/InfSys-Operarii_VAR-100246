package ru.ifmo.se.service;

import ru.ifmo.se.dto.WorkerDTO;
import ru.ifmo.se.entity.Worker;
import ru.ifmo.se.repository.WorkerRepository;
import ru.ifmo.se.util.EntityMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final UserService userService;
    private final EntityMapper entityMapper;

    public List<WorkerDTO> getAllWorkers() {
        return workerRepository.findAll()
                .stream()
                .map(entityMapper::toWorkerDTO)
                .collect(Collectors.toList());
    }

    public WorkerDTO getWorkerByID(Long id) {
        Worker worker = workerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Worker not found"));
        return entityMapper.toWorkerDTO(worker);
    }

    public WorkerDTO createWorker(WorkerDTO workerDTO) {
        Worker worker = entityMapper.toWorkerEntity(workerDTO);
        worker.setCreator(userService.getCurrentUser());
        worker.setCreationDate(LocalDateTime.now());
        Worker savedWorker = workerRepository.save(worker);
        return entityMapper.toWorkerDTO(savedWorker);
    }

    public WorkerDTO updateWorker(Long id, WorkerDTO workerDTO) {
        Worker existingWorker = workerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Worker not found"));
        if(!userService.canModifyWorker(existingWorker)) {
            throw new IllegalArgumentException("You do not have permission to modify this object");
        }

        Worker updatedWorker = entityMapper.toWorkerEntity(workerDTO);
        updatedWorker.setId(existingWorker.getId());
        updatedWorker.setCreator(userService.getCurrentUser());
        updatedWorker.setCreationDate(existingWorker.getCreationDate());

        Worker savedWorker = workerRepository.save(updatedWorker);
        return entityMapper.toWorkerDTO(savedWorker);
    }

    @Transactional
    public void deleteWorker(Long id) {
        Worker worker = workerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Worker not found"));
        if(!userService.canModifyWorker(worker)) {
            throw new IllegalArgumentException("You do not have permission to modify this object");
        }
        workerRepository.delete(worker);
    }
}
