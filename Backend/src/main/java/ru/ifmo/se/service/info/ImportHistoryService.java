package ru.ifmo.se.service.info;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.ifmo.se.dto.info.ImportHistoryDTO;
import ru.ifmo.se.entity.info.ImportHistory;
import ru.ifmo.se.entity.info.ImportStatus;
import ru.ifmo.se.dto.data.WorkerDTO;
import ru.ifmo.se.exception.JSONParsingException;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.repository.info.ImportHistoryRepository;

import java.time.LocalDateTime;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import ru.ifmo.se.service.data.WorkerService;
import ru.ifmo.se.service.user.UserService;
import ru.ifmo.se.util.EntityMapper;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportHistoryService {

    private final ImportHistoryRepository importHistoryRepository;
    private final WorkerService workerService;
    private final EntityMapper entityMapper;
    private final UserService userService;

    public ImportHistoryDTO importWorkers(MultipartFile file, String jsonData) {
        User currentUser = userService.getCurrentUser();
        ImportHistory importHistory = new ImportHistory();
        importHistory.setStatus(ImportStatus.IN_PROGRESS);
        importHistory.setTimestamp(LocalDateTime.now());
        importHistory.setUser(currentUser);
        log.info("Импортируется объекты со статусом: В ПРОЦЕССЕ для пользователя: {}", currentUser.getUsername());

        try {
            List<WorkerDTO> workers = parseJSONToWorkerList(jsonData);
            log.info("Обработал {} работников из данных JSON.", workers.size());

            for (WorkerDTO workerDTO : workers) {
                log.info("Создается работник: {}", workerDTO.getName());
                workerService.createWorker(workerDTO);
            }

            log.info("Операция импорта прошла успешно, добавлены {} работников.", workers.size());
            importHistory.setStatus(ImportStatus.SUCCESS);
            importHistory.setAddedObjectsCount(workers.size());
        } catch (RuntimeException e) {
            importHistory.setStatus(ImportStatus.FAILURE);
            importHistory.setAddedObjectsCount(0);
            log.error("Возникла ошибка при импорте: {}", e.getMessage());
            throw new JSONParsingException("Ошибка парсинга JSON-данных: " + e.getMessage(), e);
        } finally {
            log.info("Сохраняется операция импорта со следующим статусом: {}", importHistory.getStatus());
            importHistoryRepository.save(importHistory);
        }
        return entityMapper.toImportHistoryDTO(importHistory);
    }

    @Transactional(readOnly = true)
    public List<ImportHistoryDTO> getImportHistory() {
        log.info("Получение историй импортов...");
        List<ImportHistory> history = importHistoryRepository.findByStatus(ImportStatus.SUCCESS);
        return history.stream()
                .map(entityMapper::toImportHistoryDTO)
                .toList();
    }

    private List<WorkerDTO> parseJSONToWorkerList(String jsonData) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            List<WorkerDTO> workers = objectMapper.readValue(jsonData, new TypeReference<>() {});
            log.debug("Обработал данных JSON в {} объектов.", workers.size());
            return workers;
        } catch (Exception e) {
            log.error("Возникла ошибка при парсинге JSON данных: {}", e.getMessage(), e);
            throw new JSONParsingException("Ошибка парсинга JSON-данных: " + e.getMessage(), e);
        }
    }
}
