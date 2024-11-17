package ru.ifmo.se.controller;

import ru.ifmo.se.dto.admin.AdminRequestDTO;
import ru.ifmo.se.entity.user.AdminRequest;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.service.user.AdminRequestService;
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
@RequestMapping("/api/v1/admin-requests")
public class AdminRequestController {
    private final AdminRequestService adminRequestService;
    private final AdminRequestMapper adminRequestMapper;

    @PostMapping("/request")
    public ResponseEntity<String> requestAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        AdminRequest adminRequest = new AdminRequest();
        adminRequest.setRequester(currentUser);
        adminRequest.setApprovedByAll(false);
        adminRequest.setApprovedBy(new ArrayList<>());
        return (adminRequestService.createAdminRequest(adminRequest)) ?
                ResponseEntity.status(HttpStatus.CREATED).body("Запрос на админку создан.")
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Запрос уже был отправлен.");
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAdminRequestStatus() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        Optional<AdminRequest> currentRequest = adminRequestService.findByRequester(currentUser);
        Map<String, Object> response = new HashMap<>();
        if (currentRequest.isPresent()) {
            response.put("status", currentRequest.get().isApprovedByAll() ? "approved" : "pending");
            response.put("message", currentRequest.get().isApprovedByAll() ? "You are now an admin." : "Your request has not yet been processed.");
        } else {
            response.put("status", "none");
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<AdminRequestDTO>> getAllAdminRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        if(currentUser.getAuthorities().stream().anyMatch(grantedAuth -> grantedAuth.getAuthority().equals("ROLE_ADMIN"))) {
            List<AdminRequest> requests = adminRequestService.getAllAdminRequests();
            List<AdminRequestDTO> requestDTOs = requests.stream().map(adminRequestMapper::toAdminRequestDTO).toList();
            return  ResponseEntity.ok(requestDTOs);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<AdminRequest> approveRequest(@PathVariable Long id) {
        AdminRequest adminRequest = adminRequestService.getAdminRequestById(id);
        return (adminRequest != null) ? ResponseEntity.ok(adminRequest) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
