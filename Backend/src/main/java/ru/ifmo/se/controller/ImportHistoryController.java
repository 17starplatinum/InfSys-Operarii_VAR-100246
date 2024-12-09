package ru.ifmo.se.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ifmo.se.dto.info.ImportHistoryDTO;
import ru.ifmo.se.entity.info.ImportHistory;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.service.info.ImportHistoryService;
import ru.ifmo.se.util.EntityMapper;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/import-history")
public class ImportHistoryController {
    private final ImportHistoryService importHistoryService;
    private final EntityMapper entityMapper;

    @Autowired
    public ImportHistoryController(ImportHistoryService importHistoryService, EntityMapper entityMapper) {
        this.importHistoryService = importHistoryService;
        this.entityMapper = entityMapper;
    }

    @GetMapping
    public ResponseEntity<List<ImportHistoryDTO>> getImportHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        List<ImportHistory> history = importHistoryService.getImportHistory(currentUser);
        List<ImportHistoryDTO> dtoList = history.stream()
                .map(entityMapper::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }
}
