package ru.ifmo.se.repository;

import ru.ifmo.se.entity.Coordinates;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoordinatesRepository extends JpaRepository<Coordinates, Long> {
    Optional<Coordinates> findById(Long id);
}
