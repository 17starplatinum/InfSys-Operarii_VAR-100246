package ru.ifmo.se.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.dto.PaginationResponseDTO;
import ru.ifmo.se.dto.data.CoordinatesDTO;
import ru.ifmo.se.service.data.CoordinatesService;

@RestController
@RequestMapping("/api/coordinates")
@RequiredArgsConstructor
public class CoordinatesController {
    private final CoordinatesService coordinatesService;

    @GetMapping
    public ResponseEntity<PaginationResponseDTO<CoordinatesDTO>> getAllCoordinates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection
    ) {
        Page<CoordinatesDTO> peoplePage = coordinatesService.getAllCoordinates(page, size, sortBy, sortDirection);
        PaginationResponseDTO<CoordinatesDTO> responseDTO = new PaginationResponseDTO<>(
                peoplePage.getContent(),
                peoplePage.getNumber(),
                peoplePage.getTotalElements(),
                peoplePage.getTotalPages()
        );
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoordinatesDTO> getCoordinatesById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(coordinatesService.getCoordinatesById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<CoordinatesDTO> createCoordinates(@RequestBody CoordinatesDTO coordinatesDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(coordinatesService.createCoordinates(coordinatesDTO));
    }

    @PutMapping
    public ResponseEntity<CoordinatesDTO> updateCoordinates(@RequestBody CoordinatesDTO coordinatesDTO) {
        return ResponseEntity.ok(coordinatesService.updateCoordinates(coordinatesDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CoordinatesDTO> deleteCoordinates(@PathVariable Long id) {
        coordinatesService.deleteCoordinates(id);
        return ResponseEntity.noContent().build();
    }
}
