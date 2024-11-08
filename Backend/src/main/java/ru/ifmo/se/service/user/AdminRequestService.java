package ru.ifmo.se.service.user;

import ru.ifmo.se.entity.user.*;
import ru.ifmo.se.repository.user.AdminRequestRepository;
import ru.ifmo.se.repository.user.UserRepository;
import ru.ifmo.se.websocket.AdminWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminRequestService {

    private final AdminRequestRepository adminRequestRepository;
    private AdminWebSocketHandler adminWebSocketHandler;
    private final UserRepository userRepository;

    public boolean createAdminRequest(AdminRequest adminRequest) {
        try{
            if(this.getAdminRequestById(adminRequest.getId()) == null) {
                adminRequestRepository.save(adminRequest);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    public Optional<AdminRequest> findByRequester(User requester) {
        return adminRequestRepository.findByRequester(requester);
    }

    public AdminRequest getAdminRequestById(Long id) {
        return adminRequestRepository.findById(id);
    }

    public void updateAdminRequest(AdminRequest adminRequest) {
        adminRequestRepository.update(adminRequest);
    }

    public List<User> getAllAdmins() {
        return userRepository.findAllAdmins();
    }

    public boolean isRequestApprovedByAll(Long id) {
        AdminRequest adminRequest = getAdminRequestById(id);
        List<User> allAdmins = getAllAdmins();
        return new HashSet<>(adminRequest.getApprovedBy()).containsAll(allAdmins);
    }

    @Transactional(readOnly = true)
    public List<AdminRequest> getAllAdminRequests() {
        return adminRequestRepository.findAll();
    }

    public boolean approveRequest(Long requestId, User currentUser) throws Exception {
        AdminRequest adminRequest = adminRequestRepository.findById(requestId);

        if(adminRequest == null) {
            return false;
        }

        if(!adminRequest.getApprovedBy().stream().map(User::getUsername).toList().contains(currentUser.getUsername())) {
            adminRequest.getApprovedBy().add(currentUser);
            List<User> allAdmins = userRepository.findAllAdmins();

            if(adminRequest.getApprovedBy().stream().map(User::getUsername).toList().containsAll(allAdmins.stream().map(User::getUsername).toList())) {
                adminRequest.setApprovedByAll(true);
                User userToApprove = adminRequest.getRequester();
                promoteUserToAdmin(userToApprove);

                adminWebSocketHandler.sendNotificationToUser(userToApprove.getUsername(), "Ваша заявка на админ одобрена.");
            }
            this.updateAdminRequest(adminRequest);
            return true;
        }
        return false;
    }

    public void promoteUserToAdmin(User userToPromote) {
        userToPromote.setRole(UserRole.ADMIN);
        userRepository.update(userToPromote);
    }
}
