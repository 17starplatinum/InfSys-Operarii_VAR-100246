package ru.ifmo.se.controller;

import ru.ifmo.se.dto.data.MusicDTOResponse;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Worker;
import ru.ifmo.se.service.data.MusicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.service.data.WorkerService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/special")
@RequiredArgsConstructor
public class SpecialOperationsController {
    private final WorkerService workerService;

    @GetMapping("/")
}
