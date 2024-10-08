package ru.ifmo.se.repository;

import ru.ifmo.se.entity.Worker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long>{
    Optional<Worker> findById(Long id);
}
