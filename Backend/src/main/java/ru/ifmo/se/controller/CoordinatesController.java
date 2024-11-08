package ru.ifmo.se.controller;

import ru.ifmo.se.dto.data.CoordinatesDTOwID;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Coordinates;
import ru.ifmo.se.service.data.CoordinatesService;
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
@RequestMapping("/api/coordinates")
public class CoordinatesController {
    private final CoordinatesService coordinatesService;
    public CoordinatesController(CoordinatesService coordinatesService) {
        this.coordinatesService = coordinatesService;
    }

    @GetMapping
    public ResponseEntity<CoordinatesDTOwID> getUserCoordinates() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();

            List<Coordinates> coordinates = coordinatesService.getAllCoordinatesByUser(user);

            List<CoordinatesDTOwID> response = coordinates.stream()
                    .map(DTOUtil::convertToCoordinatesDTOwIDResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok((CoordinatesDTOwID) response);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
