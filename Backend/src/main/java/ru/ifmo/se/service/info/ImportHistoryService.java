package ru.ifmo.se.service.info;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.errors.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.ifmo.se.dto.data.WorkerDTO;
import ru.ifmo.se.dto.info.ImportHistoryDTO;
import ru.ifmo.se.entity.info.ImportHistory;
import ru.ifmo.se.entity.info.ImportStatus;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.exception.JSONParsingException;
import ru.ifmo.se.repository.info.ImportHistoryRepository;
import ru.ifmo.se.service.data.WorkerService;
import ru.ifmo.se.service.storage.DBTransactionResource;
import ru.ifmo.se.service.storage.MinIOService;
import ru.ifmo.se.service.storage.MinIOTransactionResource;
import ru.ifmo.se.service.user.UserService;
import ru.ifmo.se.util.EntityMapper;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportHistoryService {

    private final ImportHistoryRepository importHistoryRepository;
    private final WorkerService workerService;
    private final EntityMapper entityMapper;
    private final UserService userService;
    private final MinIOService minIOService;

    private final DBTransactionResource dbTransactionResource;
    private final MinIOTransactionResource minIOTransactionResource;

    @Value("${minio.bucketName}")
    private String bucketName;

    @Transactional(rollbackFor = Exception.class)
    public synchronized ImportHistoryDTO importWorkers(MultipartFile file, String jsonData) throws IOException {
        User currentUser = userService.getCurrentUser();
        String fileName = "import-" + UUID.randomUUID() + ".json";
        minIOTransactionResource.setFileData(fileName, file.getBytes());

        ImportHistory importHistory = new ImportHistory();
        importHistory.setStatus(ImportStatus.IN_PROGRESS);
        importHistory.setTimestamp(LocalDateTime.now());
        importHistory.setUser(currentUser);
        log.info("Импортируется объекты со статусом: В ПРОЦЕССЕ для пользователя: {}", currentUser.getUsername());

        importHistoryRepository.save(importHistory);

        int completedImports = 0;
        int failedImports = 0;

        try {
            dbTransactionResource.prepare();
            minIOTransactionResource.prepare();

            importHistoryRepository.save(importHistory);

            List<WorkerDTO> workers = parseJSONToWorkerList(jsonData);
            log.info("Обработал {} работников из данных JSON.", workers.size());

            for (WorkerDTO workerDTO : workers) {
                try {
                    log.info("Создается работник: {}", workerDTO.getName());
                    workerService.createWorker(workerDTO);
                    completedImports++;
                } catch (IllegalArgumentException e) {
                    failedImports++;
                    log.warn("Работник '{}' не добавлен: {}", workerDTO.getName(), e.getMessage());
                    throw e;
                }
            }

            if(failedImports == 0) {
                importHistory.setStatus(ImportStatus.SUCCESS);
            } else if(completedImports == 0) {
                importHistory.setStatus(ImportStatus.FAILURE);
            } else {
                importHistory.setStatus(ImportStatus.PARTIAL_SUCCESS);
            }

            importHistory.setFileName(fileName);
            importHistory.setAddedObjectsCount(completedImports);

            importHistoryRepository.save(importHistory);

            dbTransactionResource.commit();
            minIOTransactionResource.commit();

            log.info("Операция импорта прошла успешно, добавлены {} работников, не добавлены {}.", completedImports, failedImports);
            return entityMapper.toImportHistoryDTO(importHistory);
        } catch (Exception e) {
            log.error("Ошибка при импорте: {}", e.getMessage(), e);

            try {
                dbTransactionResource.rollback();
            } catch (Exception ex) {
                log.error("Ошибка при откате транзакции БД: {}", ex.getMessage(), ex);
            }

            try {
                minIOTransactionResource.rollback();
            } catch (Exception ex) {
                log.error("Ошибка при откате MinIO транзакции: {}", ex.getMessage(), ex);
            }

            throw new RuntimeException("Импорт не выполнен: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<ImportHistoryDTO> getImportHistory(Long id) {
        log.info("Получение историй импортов...");
        List<ImportHistory> history = (id == null) ? (List<ImportHistory>) importHistoryRepository.findAll() : importHistoryRepository.findByUserId(id);
        return history.stream()
                .map(
                        operation -> {
                            ImportHistoryDTO dto = entityMapper.toImportHistoryDTO(operation);
                            if (operation.getFileName() != null) {
                                try {
                                    String fileDownloadUrl = minIOService.getMinioClient().getPresignedObjectUrl(
                                            GetPresignedObjectUrlArgs.builder()
                                                    .bucket(bucketName)
                                                    .object(operation.getFileName())
                                                    .method(Method.GET)
                                                    .build()
                                    );
                                    dto.setDownloadUrl(getPresignedUrl(operation.getFileName()));
                                } catch (ErrorResponseException | InsufficientDataException | InternalException |
                                         InvalidKeyException | InvalidResponseException | IOException |
                                         NoSuchAlgorithmException | XmlParserException | ServerException e) {
                                    throw new RuntimeException("Ошибка при получении ссылки на файл в MinIO: " + e.getMessage(), e);
                                }
                            }
                            return dto;
                        }
                )
                .toList();
    }

    private String getPresignedUrl(String fileName) {
        return minIOTransactionResource.getMinIOService().getPresignedUrl(fileName);
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
