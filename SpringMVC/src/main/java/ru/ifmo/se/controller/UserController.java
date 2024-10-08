package ru.ifmo.se.controller;

import ru.ifmo.se.dto.AdminApprovalDTO;
import ru.ifmo.se.dto.UserLoginDTO;
import ru.ifmo.se.dto.UserRegistrationDTO;
import ru.ifmo.se.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationDTO userRegistrationDTO) {
        userService.registerUser(userRegistrationDTO);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody UserLoginDTO userLoginDTO) {
        String token = userService.login(userLoginDTO);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/request-admin")
    public ResponseEntity<String> requestAdminApproval(@RequestBody AdminApprovalDTO adminApprovalDTO) {
        userService.requestAdminApproval(adminApprovalDTO.getUserID());
        return ResponseEntity.ok("Admin approval requested");
    }

    @PostMapping("/approve-admin")
    public ResponseEntity<String> approveAdmin(@RequestBody AdminApprovalDTO approvalDTO) {
        userService.approveAdmin(approvalDTO);
        return ResponseEntity.ok("Admin rights granted");
    }
}
