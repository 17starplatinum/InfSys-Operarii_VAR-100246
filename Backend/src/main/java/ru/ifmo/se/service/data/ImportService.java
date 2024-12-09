package ru.ifmo.se.service.data;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validation;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ifmo.se.dto.data.WorkerDTO;
import ru.ifmo.se.dto.info.ImportHistoryDTO;
import ru.ifmo.se.entity.data.Worker;
import ru.ifmo.se.entity.info.ImportHistory;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.repository.data.WorkerRepository;
import ru.ifmo.se.repository.info.ImportHistoryRepository;
import ru.ifmo.se.util.EntityMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Log4j2
@Service
@RequiredArgsConstructor
public class ImportService {
    private final ObjectMapper objectMapper;
    private final EntityMapper entityMapper;
    private final ImportHistoryRepository importHistoryRepository;
    private final WorkerRepository workerRepository;

    @Resource
    private ImportService importServiceResource;

    @Transactional
    public ImportHistoryDTO importWorkersFromFile(MultipartFile file, User user) throws IOException {
        if(file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        List<WorkerDTO> workerDTOList = objectMapper.readValue(file.getInputStream(), new TypeReference<>() {});

        int successfulImports = 0;
        int totalObjects = workerDTOList.size();
        List<String> errors = new ArrayList<>();
        List<Worker> workers = new ArrayList<>();
        Worker tmp;
        for(WorkerDTO workerDTO : workerDTOList) {
            try {
                tmp = importServiceResource.processWorker(workerDTO, user);
                workers.add(tmp);
                successfulImports++;
            } catch (ConstraintViolationException e) {
                log.error("Validation failed for DTO: {}, Error: {}", workerDTO, e.getMessage());
            } catch (Exception e) {
                log.error(e.getMessage());
            }
        }
        String status = (successfulImports == totalObjects) ? "SUCCESS" : "FAILED";
        ImportHistory history = createImportHistory(totalObjects, successfulImports, user, status);
        return entityMapper.fromEntity(history);
    }

    @Transactional
    public Worker processWorker(WorkerDTO workerDTO, User user) {
        validateWorkerDTO(workerDTO);

        // Тотальное военное преступление
        Worker worker = entityMapper.toWorkerEntity(workerDTO,
                entityMapper.toCoordinatesEntity(workerDTO.getCoordinates()),
                entityMapper.toOrganizationEntity(workerDTO.getOrganization(),
                        entityMapper.toAddressEntity(workerDTO.getOrganization().getOfficialAddress(),
                                entityMapper.toLocationEntity(workerDTO.getOrganization().getOfficialAddress().getTown())),
                        entityMapper.toAddressEntity(workerDTO.getOrganization().getPostalAddress(),
                                entityMapper.toLocationEntity(workerDTO.getOrganization().getPostalAddress().getTown()))),
                entityMapper.toPersonEntity(workerDTO.getPerson(),
                        entityMapper.toLocationEntity(workerDTO.getPerson().getLocation())));
        worker.setCreatedBy(user);
        workerRepository.save(worker);
        return worker;
    }

    private ImportHistory createImportHistory(int totalObjects, int successfulImports, User user, String status) {
        ImportHistory importHistory = new ImportHistory();
        importHistory.setStatus(status);
        importHistory.setUser(user);
        importHistory.setTotalObjectsCount(totalObjects);
        importHistory.setAddedObjectsCount(successfulImports);
        return importHistoryRepository.save(importHistory);
    }

    private void validateWorkerDTO(WorkerDTO workerDTO) throws ConstraintViolationException {
        Set<ConstraintViolation<WorkerDTO>> violationSet = Validation.buildDefaultValidatorFactory().getValidator().validate(workerDTO);
        if(!violationSet.isEmpty()) {
            throw new ConstraintViolationException("Validation failed: ", violationSet);
        }
    }
}
