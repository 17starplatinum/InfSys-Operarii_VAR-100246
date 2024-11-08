package ru.ifmo.se.service.data;

import ru.ifmo.se.dto.data.WorkerDTORequest;
import ru.ifmo.se.entity.data.Worker;
import ru.ifmo.se.repository.entity.WorkerRepository;
import ru.ifmo.se.util.mapper.EntityMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final UserService userService;
    private final EntityMapper entityMapper;

    public List<WorkerDTORequest> getAllWorkers() {
        return workerRepository.findAll()
                .stream()
                .map(entityMapper::toWorkerDTO)
                .collect(Collectors.toList());
    }

    public WorkerDTORequest getWorkerByID(Long id) {
        Worker worker = workerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Worker not found"));
        return entityMapper.toWorkerDTO(worker);
    }

    public WorkerDTORequest createWorker(WorkerDTORequest workerDTORequest) {
        Worker worker = entityMapper.toWorkerEntity(workerDTORequest);
        worker.setCreator(userService.getCurrentUser());
        worker.setCreationDate(LocalDateTime.now());
        Worker savedWorker = workerRepository.save(worker);
        return entityMapper.toWorkerDTO(savedWorker);
    }

    public WorkerDTORequest updateWorker(Long id, WorkerDTORequest workerDTORequest) {
        Worker existingWorker = workerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Worker not found"));
        if(!userService.canModifyWorker(existingWorker)) {
            throw new IllegalArgumentException("You do not have permission to modify this object");
        }

        Worker updatedWorker = entityMapper.toWorkerEntity(workerDTORequest);
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
