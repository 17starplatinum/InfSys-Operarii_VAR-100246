package ru.ifmo.se.controller;

import ru.ifmo.se.dto.admin.AdminRequestDTO;
import ru.ifmo.se.entity.user.AdminRequest;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.service.user.AdminRequestService;
import ru.ifmo.se.service.user.AuthenticationService;
import ru.ifmo.se.util.AdminRequestMapper;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@RequestMapping("/api/admin-request")
public class AdminRequestController {
    private final AdminRequestService adminRequestService;
    private final AuthenticationService authenticationService;
    private final AdminRequestMapper adminRequestMapper;

    @PostMapping("/request")
    public ResponseEntity<String> requestAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        AdminRequest adminRequest = new AdminRequest();
        adminRequest.setRequester(currentUser);
        adminRequest.setApprovedByAll(false);
        adminRequest.setApprovedBy(new ArrayList<>());
        if (adminRequestService.createAdminRequest(adminRequest)) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Запрос на админку создан.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Запрос уже был отправлен.");
        }
    }
}
