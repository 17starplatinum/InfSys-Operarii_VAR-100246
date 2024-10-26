package ru.ifmo.se.controller;

import ru.ifmo.se.dto.AdminApprovalDTO;
import ru.ifmo.se.dto.AuthLoginResponseDTO;
import ru.ifmo.se.dto.UserLoginDTO;
import ru.ifmo.se.dto.UserRegistrationDTO;
import ru.ifmo.se.entity.User;
import ru.ifmo.se.service.JWTService;
import ru.ifmo.se.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    private final JWTService jwtService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationDTO userRegistrationDTO) {
        userService.registerUser(userRegistrationDTO);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponseDTO> loginUser(@RequestBody UserLoginDTO userLoginDTO) {
        User authenticatedUser = userService.login(userLoginDTO);
        String token = jwtService.generateToken(authenticatedUser);
        AuthLoginResponseDTO authLoginResponseDTO = AuthLoginResponseDTO.builder().token(token).expiration(jwtService.getExpirationTime()).build();
        return ResponseEntity.ok(authLoginResponseDTO);
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
