package ru.ifmo.se.repository.data.audit;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.audit.CoordinatesAudit;

@Repository
public interface CoordinatesAuditRepository extends CrudRepository<CoordinatesAudit, Long> {
    void deleteAllByCoordinatesId(Long id);
}