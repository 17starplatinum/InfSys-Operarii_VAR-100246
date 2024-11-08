package ru.ifmo.se.controller;

import ru.ifmo.se.dto.data.*;
import ru.ifmo.se.dto.data.response.WorkerDTOResponse;
import ru.ifmo.se.entity.data.Worker;
import ru.ifmo.se.entity.data.enumerated.*;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.service.data.WorkerService;
import ru.ifmo.se.util.DTOUtil;
import ru.ifmo.se.websocket.WorkerWebSocketHandler;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@RequestMapping("/api/workers")
public class WorkerController {
    private final WorkerService workerService;

    @PostMapping
    public ResponseEntity<?> createWorker(@RequestBody @Valid WorkerDTORequest workerDTORequest, BindingResult bindingResult) throws IOException {
        if(bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getAllErrors().forEach(error -> errors.put(error.getDefaultMessage(), error.getDefaultMessage()));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        try {
            Worker savedWorker = workerService.saveWorker(workerDTORequest, user);
            return new ResponseEntity<>(DTOUtil.convertToResponse(savedWorker), HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Ошибка при создании работника", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<WorkerDTOResponse>> getAllWorkers() {
        List<Worker> workers = workerService.getAllWorkers();
        List<WorkerDTOResponse> workerDTOResponses = workers.stream()
                .map(DTOUtil::convertToResponse)
                .collect(Collectors.toList());
        return new ResponseEntity.ok(workerDTOResponses);
    }
}
