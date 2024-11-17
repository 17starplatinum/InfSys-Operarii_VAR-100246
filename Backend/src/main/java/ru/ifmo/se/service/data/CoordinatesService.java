package ru.ifmo.se.service.data;

import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Coordinates;
import ru.ifmo.se.repository.data.CoordinatesRepository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class CoordinatesService {
    private final CoordinatesRepository coordinatesRepository;
    public List<Coordinates> getAllCoordinatesByUser(User user) {
        return coordinatesRepository.findByOwner(user);
    }
}
