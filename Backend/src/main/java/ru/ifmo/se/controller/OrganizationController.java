package ru.ifmo.se.controller;

import ru.ifmo.se.dto.data.OrganizationDTOwID;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Organization;
import ru.ifmo.se.service.data.OrganizationService;
import ru.ifmo.se.util.DTOUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orgs")
public class OrganizationController {
    private final OrganizationService organizationService;
    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping
    public ResponseEntity<List<OrganizationDTOwID>> getUserOrganizations() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();

            List<Organization> organizations = organizationService.getOrganizationsByUser(user);
            List<OrganizationDTOwID> response = organizations.stream().map(DTOUtil::convertToOrganizationDTOwIDResponse).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();
        }
        return null;
    }
}
