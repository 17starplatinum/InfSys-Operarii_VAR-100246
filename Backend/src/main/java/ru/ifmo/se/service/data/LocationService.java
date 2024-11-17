package ru.ifmo.se.service.data;

import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Location;
import ru.ifmo.se.repository.data.LocationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class LocationService {
    private final LocationRepository locationRepository;
    public List<Location> getAllLocationsByUser(User user) {
        return locationRepository.findByOwner(user);
    }
}
