package ru.ifmo.se.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ifmo.se.dto.user.*;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.service.user.JWTService;
import ru.ifmo.se.service.user.UserService;
import ru.ifmo.se.util.EntityMapper;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JWTService jwtService;
    private final EntityMapper entityMapper;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserRegistrationDTO userRegistrationDTO) {
        User user = userService.registerUser(userRegistrationDTO);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/admin-exists")
    public ResponseEntity<Boolean> adminExists() {
        return ResponseEntity.ok(userService.adminExists());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponseDTO> loginUser(@RequestBody UserLoginDTO userLoginDTO) {
        User authenticatedUser = userService.login(userLoginDTO);
        String token = jwtService.generateToken(authenticatedUser);
        AuthLoginResponseDTO authLoginResponseDTO = AuthLoginResponseDTO.builder()
                .token(token)
                .expiration(jwtService.getExpirationTime())
                .build();
        return ResponseEntity.ok(authLoginResponseDTO);
    }

    @GetMapping("/admin-requests")
    public ResponseEntity<List<UserDTO>> getAdminRequests() {
        return ResponseEntity.ok(userService.getApprovalRequests());
    }

    @GetMapping("/admin-requests/status")
    public ResponseEntity<String> getAdminRequestsStatus(@RequestParam Long userId) {
        String status = userService.getAdminRequestStatus(userId);
        return ResponseEntity.ok(status);
    }

    @PostMapping("/request-admin")
    public ResponseEntity<String> requestAdminApproval() {
        User currentUser = userService.getCurrentUser();
        String response = userService.requestAdminApproval(currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/approve-admin/{id}")
    public ResponseEntity<String> approveAdmin(@PathVariable Long id) {
        userService.approveRequest(id);
        return ResponseEntity.ok("Admin request approved.");
    }

    @PostMapping("/reject-admin/{id}")
    public ResponseEntity<String> rejectAdmin(@PathVariable Long id) {
        userService.rejectRequest(id);
        return ResponseEntity.ok("Admin request rejected.");
    }

    @GetMapping("/current")
    public ResponseEntity<UserDTO> getCurrentUser() {
        User currentUser = userService.getCurrentUser();
        UserDTO currentUserDTO = entityMapper.toUserDTO(currentUser);
        return ResponseEntity.ok(currentUserDTO);
    }

    @PutMapping("/current")
    public ResponseEntity<UserUpdateResponseDTO> updateCurrentUser(@RequestBody UserUpdateDTO userUpdateDTO) {
        UserUpdateResponseDTO responseDTO = userService.updateCurrentUser(userUpdateDTO);
        return ResponseEntity.ok(responseDTO);
    }
}
