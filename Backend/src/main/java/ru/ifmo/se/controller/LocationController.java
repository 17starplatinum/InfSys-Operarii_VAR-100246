package ru.ifmo.se.controller;

import ru.ifmo.se.dto.LocationDTO;
import ru.ifmo.se.dto.PaginationResponseDTO;
import ru.ifmo.se.service.LocationService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;


}
