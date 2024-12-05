package ru.ifmo.se.service.data;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.dto.data.WorkerDTO;
import ru.ifmo.se.dto.data.filter.WorkerFilterCriteria;
import ru.ifmo.se.entity.data.Coordinates;
import ru.ifmo.se.entity.data.Organization;
import ru.ifmo.se.entity.data.Person;
import ru.ifmo.se.entity.data.Worker;
import ru.ifmo.se.entity.data.audit.AuditOperation;
import ru.ifmo.se.repository.data.OrganizationRepository;
import ru.ifmo.se.repository.data.WorkerRepository;
import ru.ifmo.se.service.data.audit.AuditService;
import ru.ifmo.se.service.user.UserService;
import ru.ifmo.se.util.EntityMapper;
import ru.ifmo.se.util.filter.FilterProcessor;
import ru.ifmo.se.util.pagination.PaginationHandler;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final CoordinatesService coordinatesService;
    private final OrganizationService organizationService;
    private final PersonService personService;
    private final UserService userService;
    private final AuditService auditService;
    private final EntityMapper entityMapper;
    private final FilterProcessor<WorkerDTO, WorkerFilterCriteria> workerFilterProcessor;
    private final PaginationHandler paginationHandler;
    private final OrganizationRepository organizationRepository;

    private static final String NOT_FOUND_MESSAGE = "Worker not found";
    @Transactional(readOnly = true)
    public Page<WorkerDTO> getAllWorkers(String name, String organizationName,
                                         int page, int size, String sortBy, String sortDirection) {
        WorkerFilterCriteria workerFilterCriteria = new WorkerFilterCriteria();
        workerFilterCriteria.setName(name);
        workerFilterCriteria.setOrganizationName(organizationName);

        Pageable pageable = paginationHandler.createPageable(page, size, sortBy, sortDirection);
        return workerFilterProcessor.filter(workerFilterCriteria, pageable);
    }

    @Transactional(readOnly = true)
    public WorkerDTO getWorkerById(long id) {
        Worker worker = workerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        return entityMapper.toWorkerDTO(worker);
    }

    @Transactional
    public WorkerDTO createWorker(WorkerDTO workerDTO) {
        Coordinates coordinates = coordinatesService.createOrUpdateCoordinatesForWorker(workerDTO.getCoordinates());
        Organization organization = organizationService.createOrUpdateOrganizationForWorker(workerDTO.getOrganization());
        Person person = personService.createOrUpdatePersonForWorker(workerDTO.getPerson());
        Worker worker = entityMapper.toWorkerEntity(workerDTO, coordinates, organization, person);
        worker.setCreatedBy(userService.getCurrentUser());
        worker.setCreationDate(LocalDateTime.now());

        Worker savedWorker = workerRepository.save(worker);
        auditService.auditWorker(savedWorker, AuditOperation.CREATE);
        return entityMapper.toWorkerDTO(savedWorker);
    }

    @Transactional
    public WorkerDTO updateWorker(Long id, WorkerDTO workerDTO) {
        Worker worker = workerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        if (userService.canModifyWorker(worker)) {
            throw new IllegalArgumentException("You are not allowed to modify this Worker.");
        }

        Coordinates coordinates = coordinatesService.createOrUpdateCoordinatesForWorker(workerDTO.getCoordinates());
        Organization organization = organizationService.createOrUpdateOrganizationForWorker(workerDTO.getOrganization());
        Person person = personService.createOrUpdatePersonForWorker(workerDTO.getPerson());
        Worker updatedWorker = entityMapper.toWorkerEntity(workerDTO, coordinates, organization, person);

        updatedWorker.setId(workerDTO.getId());
        updatedWorker.setCreatedBy(workerDTO.getCreatedBy());
        updatedWorker.setCreationDate(workerDTO.getCreationDate());

        Worker savedWorker = workerRepository.save(updatedWorker);
        auditService.auditWorker(savedWorker, AuditOperation.UPDATE);

        return entityMapper.toWorkerDTO(worker);
    }

    @Transactional
    public void deleteWorker(Long id) {
        Worker worker = workerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        if (userService.canModifyWorker(worker)) {
            throw new IllegalArgumentException("You are not allowed to delete this Worker.");
        }
        auditService.deleteWorkerAudits(worker.getId());
        workerRepository.delete(worker);
    }

    @Transactional
    public void deleteWorkerByPerson(Long personId) {
        Worker worker = workerRepository.findWorkerByPersonId(personId).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        if (userService.canModifyWorker(worker)) {
            throw new IllegalArgumentException("You are not allowed to delete this Worker.");
        }
        auditService.deleteWorkerAudits(worker.getId());
        workerRepository.delete(worker);
    }

    @Transactional(readOnly = true)
    public Long countWorkersByPerson(Long personId) {
        return workerRepository.countWorkersByPerson(personId);
    }

    @Transactional(readOnly = true)
    public Long countWorkersWithLessRating(Integer rating) {
        return workerRepository.countWorkersWithLessRating(rating);
    }

    @Transactional
    public int fireWorkerFromOrganization(Long workerId) {
        Worker worker = workerRepository.findById(workerId).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        if(worker == null || worker.getOrganization() == null) {
            return -1;
        }
        Long organizationId = worker.getOrganization().getId();
        workerRepository.fireWorkerFromOrganization(workerId);
        organizationRepository.updateEmployeesCount(organizationId, -1);
        return 0;
    }

    @Transactional
    public int transferWorkerToAnotherOrganization(Long organizationId, Long workerId) {
        Worker worker = workerRepository.findById(workerId).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        if(worker.getOrganization() == null) {
            return -1;
        }
        Long organizationFromId = worker.getOrganization().getId();
        organizationRepository.updateEmployeesCount(organizationFromId, -1);
        workerRepository.transferWorkerToAnotherOrganization(organizationId, workerId);
        organizationRepository.updateEmployeesCount(organizationId, 1);
        return 0;
    }
}
