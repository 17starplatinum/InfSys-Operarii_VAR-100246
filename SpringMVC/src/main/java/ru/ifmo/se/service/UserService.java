package ru.ifmo.se.service;

import ru.ifmo.se.dto.UserLoginDTO;
import ru.ifmo.se.dto.UserRegistrationDTO;
import ru.ifmo.se.dto.AdminApprovalDTO;
import ru.ifmo.se.entity.User;
import ru.ifmo.se.entity.UserRole;
import ru.ifmo.se.entity.Worker;
import ru.ifmo.se.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class UserService implements UserDetailsService {
    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    private JWTService jwtService;

    private AuthenticationManager authManager;

    @Autowired
    public void setAuthenticationManager(AuthenticationManager authManager) {
        this.authManager = authManager;
    }

    @Autowired
    public void setJwtService(JWTService jwtService) {
        this.jwtService = jwtService;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(UserRegistrationDTO registrationDTO) {
        if(userRepository.findByUsername(registrationDTO.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username is already in use");
        }

        User user = new User();
        user.setUsername(registrationDTO.getUsername());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        user.setRole(UserRole.USER);

        return userRepository.save(user);
    }
    @Transactional
    public User login(UserLoginDTO loginDTO) {
        log.info("authenticate()");
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword())
        );
        log.info("authenticate() ended");

        return userRepository.findByUsername(loginDTO.getUsername()).orElseThrow();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("Username not found: " + username));
    }

    @Transactional
    public User requestAdminApproval(long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if(user.getRole() != UserRole.USER) {
            throw new IllegalArgumentException("You can request admin rights only if you're a user");
        }
        user.setPendingAdminApproval(true);
        return userRepository.save(user);
    }

    @Transactional
    public User approveAdmin(AdminApprovalDTO approvalDTO) {
        User user = userRepository.findById(approvalDTO.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if(!user.isPendingAdminApproval()) {
            throw new IllegalArgumentException("This user has no pending admin approval");
        }

        user.setRole(UserRole.ADMIN);
        user.setPendingAdminApproval(false);

        return userRepository.save(user);
    }

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            String username = ((UserDetails)principal).getUsername();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        } else {
            throw new IllegalStateException("Authentication principal is not of type UserDetails");
        }
    }

    public boolean canModifyWorker(Worker worker) {
        User currentUser = getCurrentUser();
        return worker.getCreator().equals(currentUser) || currentUser.getRole() == UserRole.ADMIN;
    }
}
