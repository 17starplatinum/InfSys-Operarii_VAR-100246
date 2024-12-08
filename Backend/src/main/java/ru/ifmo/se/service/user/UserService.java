package ru.ifmo.se.service.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.dto.user.*;
import ru.ifmo.se.entity.data.Worker;
import ru.ifmo.se.entity.data.enumerated.AdminRequestStatus;
import ru.ifmo.se.entity.data.enumerated.UserRole;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.exception.UserAlreadyExistsException;
import ru.ifmo.se.repository.user.UserRepository;
import ru.ifmo.se.status.AdminRequestStatusHandler;
import ru.ifmo.se.util.EntityMapper;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserService implements UserDetailsService {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JWTService jwtService;
    private AuthenticationManager authenticationManager;
    private EntityMapper entityMapper;
    private Map<String, AdminRequestStatusHandler> statusHandlerMap;

    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setEntityMapper(EntityMapper entityMapper) {
        this.entityMapper = entityMapper;
    }

    @Autowired
    public void setStatusHandlerMap(Map<String, AdminRequestStatusHandler> statusHandlerMap) {
        this.statusHandlerMap = statusHandlerMap;
    }

    @Autowired
    public void setJwtService(JWTService jwtService) {
        this.jwtService = jwtService;
    }


    @Transactional
    public User registerUser(UserRegistrationDTO registrationDTO) {
        if (userRepository.findByUsername(registrationDTO.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username is already in use.");
        }
        User newUser = new User();
        newUser.setUsername(registrationDTO.getUsername());
        newUser.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        newUser.setRole(UserRole.USER);
        newUser.setAdminRequestStatus(AdminRequestStatus.NONE);

        return userRepository.save(newUser);
    }

    @Transactional
    public User login(UserLoginDTO loginDTO) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword()));
            return userRepository.findByUsername(loginDTO.getUsername()).orElseThrow(() -> new UsernameNotFoundException("User with the name: " + loginDTO.getUsername() + " has not been found."));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password.");
        } catch (UsernameNotFoundException e) {
            throw new UsernameNotFoundException("Username '" + loginDTO.getUsername() + "' not found.");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User with the name: " + username + " has not been found."));
    }

    public boolean adminExists() {
        return userRepository.existsByRole(UserRole.ADMIN);
    }

    @Transactional
    public String requestAdminApproval(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User has not been found."));
        if (user.getRole() != UserRole.USER) {
            throw new IllegalArgumentException("Only users can make a request for admin rights.");
        }
        if (!adminExists()) {
            user.setRole(UserRole.ADMIN);
            user.setAdminRequestStatus(AdminRequestStatus.ACCEPTED);
            userRepository.save(user);
            return "The system has no admins. Therefore the control has been automatically transferred to you.";
        } else {
            user.setAdminRequestStatus(AdminRequestStatus.PENDING);
            userRepository.save(user);
            return "Waiting for admin approval";
        }
    }

    @Transactional(readOnly = true)
    public String getAdminRequestStatus(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User has not been found."));

        AdminRequestStatusHandler adminRequestStatusHandler = statusHandlerMap.get(user.getRole().toString());
        if (adminRequestStatusHandler == null) {
            throw new IllegalStateException("Handler for the following status: " + user.getAdminRequestStatus().toString() + " has not been found.");
        }
        return adminRequestStatusHandler.getStatusMessage();
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getApprovalRequests() {
        return userRepository.findAllByAdminRequestStatus(AdminRequestStatus.PENDING).stream().map(entityMapper::toUserDTO).collect(Collectors.toList());
    }

    @Transactional
    public void approveRequest(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User has not been found."));
        if (user.getAdminRequestStatus() != AdminRequestStatus.PENDING) {
            throw new IllegalArgumentException("There are no pending requests.");
        }

        user.setRole(UserRole.ADMIN);
        user.setAdminRequestStatus(AdminRequestStatus.ACCEPTED);
        userRepository.save(user);
    }

    @Transactional
    public void rejectRequest(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User has not been found."));
        if (user.getAdminRequestStatus() != AdminRequestStatus.PENDING) {
            throw new IllegalArgumentException("There are no pending requests.");
        }
        user.setAdminRequestStatus(AdminRequestStatus.REJECTED);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User with the name: " + username + " has not been found."));
        } else {
            throw new IllegalStateException("Authentication Principal does not have a UserDetails type.");
        }
    }

    @Transactional
    public boolean canModifyWorker(Worker worker) {
        User currentUser = getCurrentUser();
        return !Objects.equals(worker.getCreatedBy().getUsername(), currentUser.getUsername()) && currentUser.getRole() != UserRole.ADMIN;
    }

    @Transactional
    public UserUpdateResponseDTO updateCurrentUser(UserUpdateDTO userUpdateDTO) {
        User currentUser = getCurrentUser();
        if (userUpdateDTO.getUsername() != null && !userUpdateDTO.getUsername().isEmpty()) {
            if (userRepository.findByUsername(userUpdateDTO.getUsername()).isPresent()) {
                throw new UserAlreadyExistsException("Username is already taken.");
            }
            currentUser.setUsername(userUpdateDTO.getUsername());
        }
        if (userUpdateDTO.getPassword() != null && !userUpdateDTO.getPassword().isEmpty()) {
            currentUser.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
        }
        User updatedUser = userRepository.save(currentUser);
        String newToken = jwtService.generateToken(updatedUser);
        return new UserUpdateResponseDTO(newToken, entityMapper.toUserDTO(updatedUser));
    }
}
