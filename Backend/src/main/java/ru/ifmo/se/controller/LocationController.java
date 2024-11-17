package ru.ifmo.se.controller;


import ru.ifmo.se.dto.data.LocationDTOwID;
import ru.ifmo.se.entity.data.Location;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.service.data.LocationService;
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
@RequestMapping("/api/v1/locations")
public class LocationController {
    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public ResponseEntity<LocationDTOwID> getUserLocations() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();

            List<Location> location = locationService.getAllLocationsByUser(user);

            List<LocationDTOwID> response = location.stream()
                    .map(DTOUtil::convertToLocationDTOwIDResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok((LocationDTOwID) response);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
