package ru.ifmo.se.util;

import ru.ifmo.se.dto.admin.AdminRequestDTO;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.user.AdminRequest;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class AdminRequestMapper {
    public AdminRequestDTO toAdminRequestDTO(AdminRequest adminRequest) {
        AdminRequestDTO adminRequestDTO = new AdminRequestDTO();
        adminRequestDTO.setId(adminRequest.getId());
        adminRequestDTO.setRequesterUsername(adminRequest.getRequester().getUsername());
        adminRequestDTO.setApprovedByAll(adminRequestDTO.isApprovedByAll());
        adminRequestDTO.setApprovedByUsernames(adminRequest.getApprovedBy().stream().map(User::getUsername).collect(Collectors.toList()));
        return adminRequestDTO;
    }
}
