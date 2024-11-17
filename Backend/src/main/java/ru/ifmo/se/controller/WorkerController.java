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
        return ResponseEntity.ok(workerDTOResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerDTOResponse> getWorkerById(@PathVariable long id) {
        Worker worker = workerService.getWorkerById(id);
        return ResponseEntity.ok(DTOUtil.convertToResponse(worker));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkerDTOResponse> updateWorker(@PathVariable long id, @RequestBody @Valid WorkerDTORequest workerDTORequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Worker currentWorker = workerService.getWorkerById(id);
        if(!currentWorker.getOwner().getId().equals(user.getId()) && user.getAuthorities().stream().noneMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Worker updatedWorker = workerService.updateWorker(currentWorker, workerDTORequest, user);
        return ResponseEntity.ok(DTOUtil.convertToResponse(updatedWorker));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkerById(@PathVariable long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        Worker currentWorker = workerService.getWorkerById(id);
        if(!currentWorker.getOwner().getId().equals(user.getId()) && user.getAuthorities().stream().noneMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        workerService.deleteWorkerById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
