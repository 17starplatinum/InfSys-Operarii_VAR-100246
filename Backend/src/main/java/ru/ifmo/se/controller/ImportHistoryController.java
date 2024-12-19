package ru.ifmo.se.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.ifmo.se.dto.info.ImportHistoryDTO;
import ru.ifmo.se.entity.info.ImportHistory;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.exception.FileReadException;
import ru.ifmo.se.service.info.ImportHistoryService;
import ru.ifmo.se.util.EntityMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
public class ImportHistoryController {

    private final ImportHistoryService importHistoryService;

    @PostMapping
    public ResponseEntity<ImportHistoryDTO> importWorkers(@RequestParam("file") MultipartFile file) {
        try {
            if(file.isEmpty()) {
                throw new FileReadException("Ошибка чтения файла: пусто");
            }
            String jsonData = new String(file.getBytes(), StandardCharsets.UTF_8);
            ImportHistoryDTO importHistoryDTO = importHistoryService.importWorkers(jsonData);
            return ResponseEntity.ok(importHistoryDTO);
        } catch (IOException e) {
            throw new FileReadException("Ошибка чтения файла: " + e.getMessage());
        }
    }
    @GetMapping
    public ResponseEntity<List<ImportHistoryDTO>> getImportHistory() {
        List<ImportHistoryDTO> history = importHistoryService.getImportHistory();
        return ResponseEntity.ok(history);
    }
}
