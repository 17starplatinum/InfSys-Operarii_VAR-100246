package ru.ifmo.se.controller;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.dto.PaginationResponseDTO;
import ru.ifmo.se.dto.data.WorkerDTO;
import ru.ifmo.se.service.data.WorkerService;
import ru.ifmo.se.service.info.ImportHistoryService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/workers")
public class WorkerController {
    private final WorkerService workerService;

    @GetMapping
    public ResponseEntity<PaginationResponseDTO<WorkerDTO>> getAllWorkers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String organizationName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection
    ) {
        Page<WorkerDTO> peoplePage = workerService.getAllWorkers(name, organizationName, page, size, sortBy, sortDirection);
        PaginationResponseDTO<WorkerDTO> responseDTO = new PaginationResponseDTO<>(
                peoplePage.getContent(),
                peoplePage.getNumber(),
                peoplePage.getTotalElements(),
                peoplePage.getTotalPages()
        );
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerDTO> getWorkerById(@PathVariable Long id) {
        return ResponseEntity.ok(workerService.getWorkerById(id));
    }

    @PostMapping
    public ResponseEntity<WorkerDTO> createWorker(@RequestBody WorkerDTO workerDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workerService.createWorker(workerDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkerDTO> updateWorker(@PathVariable Long id, @RequestBody WorkerDTO workerDTO) {
        return ResponseEntity.ok(workerService.updateWorker(id, workerDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<WorkerDTO> deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-by-person")
    public ResponseEntity<WorkerDTO> deleteWorkerByPerson(@RequestParam Long personId) {
        workerService.deleteWorkerByPerson(personId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count-by-people")
    public ResponseEntity<Long> countByPeople(@RequestParam Long personId) {
        Long count = workerService.countWorkersByPerson(personId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count-by-less-than-rating")
    public ResponseEntity<Long> countByLessThanRating(@RequestParam int rating) {
        Long count = workerService.countWorkersWithLessRating(rating);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/fire-worker-from-org")
    public ResponseEntity<WorkerDTO> fireWorkerFromOrg(@RequestParam Long workerId) {
        int code = workerService.fireWorkerFromOrganization(workerId);
        if (code != 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/transfer-worker-to-another-organization")
    public ResponseEntity<WorkerDTO> transferWorkerToAnotherOrganization(@RequestParam Long orgId, @RequestParam Long workerId) {
        int code = workerService.transferWorkerToAnotherOrganization(orgId, workerId);
        if (code != 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.noContent().build();
    }
}
