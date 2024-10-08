package ru.ifmo.se.controller;

import ru.ifmo.se.dto.WorkerDTO;
import ru.ifmo.se.service.WorkerService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {
    private final WorkerService workerService;

    @GetMapping
    public ResponseEntity<List<WorkerDTO>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerDTO> getWorkerByID(@PathVariable Long id) {
        return ResponseEntity.ok(workerService.getWorkerByID(id));
    }

    @PostMapping
    public ResponseEntity<WorkerDTO> createWorker(@RequestBody WorkerDTO workerDTO) {
        WorkerDTO createdWorker = workerService.createWorker(workerDTO);
        return ResponseEntity.ok(createdWorker);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkerDTO> updateWorker(@PathVariable Long id, @RequestBody WorkerDTO workerDTO) {
        WorkerDTO updatedWorker = workerService.updateWorker(id, workerDTO);
        return ResponseEntity.ok(updatedWorker);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<WorkerDTO> deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
        return ResponseEntity.noContent().build();
    }
}
