package ru.ifmo.se.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.ifmo.se.dto.info.ImportHistoryDTO;
import ru.ifmo.se.exception.FileReadException;
import ru.ifmo.se.service.info.ImportHistoryService;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

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
            ImportHistoryDTO importHistoryDTO = importHistoryService.importWorkers(file, jsonData);
            return ResponseEntity.ok(importHistoryDTO);
        } catch (IOException e) {
            throw new FileReadException("Ошибка чтения файла: " + e.getMessage());
        }
    }
    @GetMapping("/history")
    public ResponseEntity<List<ImportHistoryDTO>> getImportHistory(@RequestParam(required = false, name = "userId") Long id) {
        List<ImportHistoryDTO> history = importHistoryService.getImportHistory(id);
        return ResponseEntity.ok(history);
    }
}
