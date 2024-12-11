package ru.ifmo.se.service.data;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.dto.data.CoordinatesDTO;
import ru.ifmo.se.entity.data.Coordinates;
import ru.ifmo.se.entity.data.audit.AuditOperation;
import ru.ifmo.se.exception.EntityDeletionException;
import ru.ifmo.se.repository.data.CoordinatesRepository;
import ru.ifmo.se.service.data.audit.AuditService;
import ru.ifmo.se.service.user.UserService;
import ru.ifmo.se.util.EntityMapper;
import ru.ifmo.se.util.pagination.PaginationHandler;

@Service
@RequiredArgsConstructor
public class CoordinatesService {
    private CoordinatesRepository coordinatesRepository;
    private EntityMapper entityMapper;
    private AuditService auditService;
    private UserService userService;
    private PaginationHandler paginationHandler;
    private static final String NOT_FOUND_MESSAGE = "Coordinates not found";

    @Autowired
    public void setCoordinatesRepository(CoordinatesRepository coordinatesRepository) {
        this.coordinatesRepository = coordinatesRepository;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setAuditService(AuditService auditService) {
        this.auditService = auditService;
    }

    @Autowired
    public void setEntityMapper(EntityMapper entityMapper) {
        this.entityMapper = entityMapper;
    }

    @Autowired
    public void setPaginationHandler(PaginationHandler paginationHandler) {
        this.paginationHandler = paginationHandler;
    }

    @Transactional(readOnly = true)
    public Page<CoordinatesDTO> getAllCoordinates(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = paginationHandler.createPageable(page, size, sortBy, sortDirection);
        return coordinatesRepository.findAll(pageable).map(entityMapper::toCoordinatesDTO);
    }

    @Transactional(readOnly = true)
    public CoordinatesDTO getCoordinatesById(Long id) {
        Coordinates coordinates = coordinatesRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        return entityMapper.toCoordinatesDTO(coordinates);
    }

    @Transactional
    public CoordinatesDTO createCoordinates(CoordinatesDTO coordinatesDTO) {
        Coordinates coordinates = entityMapper.toCoordinatesEntity(coordinatesDTO);
        coordinates.setCreatedBy(userService.getCurrentUser());
        Coordinates savedCoordinates = coordinatesRepository.save(coordinates);
        auditService.auditCoordinates(savedCoordinates, AuditOperation.CREATE);
        return entityMapper.toCoordinatesDTO(savedCoordinates);
    }

    @Transactional
    public CoordinatesDTO updateCoordinates(Long id, CoordinatesDTO coordinatesDTO) {
        Coordinates coordinates = coordinatesRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));

        coordinates.setX(coordinatesDTO.getX());
        coordinates.setY(coordinatesDTO.getY());

        Coordinates savedCoordinates = coordinatesRepository.save(coordinates);
        auditService.auditCoordinates(savedCoordinates, AuditOperation.UPDATE);
        return entityMapper.toCoordinatesDTO(savedCoordinates);
    }

    @Transactional
    public Coordinates createOrUpdateCoordinatesForWorker(CoordinatesDTO coordinatesDTO) {
        if (coordinatesDTO.getId() != null) {
            Coordinates coordinates = coordinatesRepository.findById(coordinatesDTO.getId()).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));

            coordinates.setX(coordinatesDTO.getX());
            coordinates.setY(coordinatesDTO.getY());
            Coordinates savedCoordinates = coordinatesRepository.save(coordinates);
            auditService.auditCoordinates(savedCoordinates, AuditOperation.UPDATE);
            return savedCoordinates;
        } else {
            Coordinates coordinates = entityMapper.toCoordinatesEntity(coordinatesDTO);
            coordinates.setCreatedBy(userService.getCurrentUser());
            Coordinates savedCoordinates = coordinatesRepository.save(coordinates);
            auditService.auditCoordinates(savedCoordinates, AuditOperation.CREATE);
            return savedCoordinates;
        }
    }

    @Transactional
    public void deleteCoordinates(Long id) {
        Coordinates coordinates = coordinatesRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        if (!coordinates.getWorkers().isEmpty()) {
            throw new EntityDeletionException("Cannot delete Coordinates since it is linked to one or more Workers.");
        }
        auditService.deleteCoordinatesAudits(coordinates.getId());
        coordinatesRepository.delete(coordinates);
    }
}
