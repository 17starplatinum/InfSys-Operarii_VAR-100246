package ru.ifmo.se.service.user;

import ru.ifmo.se.dto.user.AuthenticationRequest;
import ru.ifmo.se.dto.user.AuthenticationResponse;
import ru.ifmo.se.dto.user.RegisterRequest;
import ru.ifmo.se.exception.UserAlreadyExistsException;
import ru.ifmo.se.entity.user.UserRole;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest registerRequest) {
        boolean userExists = userRepository.findByUsername(registerRequest.getUsername()).isPresent();

        if(userExists) {
            throw new UserAlreadyExistsException("Пользователь с таким именем уже существует");
        }

        var user = User.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(UserRole.USER)
                .build();

        userRepository.save(user);
        var token = jwtService.generateToken(user);
        UserRole userRole = user.getRole();
        return AuthenticationResponse.builder()
                .token(token)
                .userRole(userRole)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getUsername(),
                        authenticationRequest.getPassword()
                )
        );
        var user = userRepository.findByUsername(authenticationRequest.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Пользователь с таким именем не найден"));
        var token = jwtService.generateToken(user);
        UserRole userRole = user.getRole();
        return AuthenticationResponse.builder()
                .token(token)
                .userRole(userRole)
                .build();
    }
}
