package ru.ifmo.se.repository.data.audit;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.audit.LocationAudit;

@Repository
public interface LocationAuditRepository extends CrudRepository<LocationAudit, Long> {
    void deleteAllByLocationId(Long id);
}