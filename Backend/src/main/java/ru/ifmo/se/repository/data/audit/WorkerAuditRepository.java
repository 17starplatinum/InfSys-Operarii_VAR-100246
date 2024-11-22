package ru.ifmo.se.repository.data.audit;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.audit.WorkerAudit;

@Repository
public interface WorkerAuditRepository extends CrudRepository<WorkerAudit, Long> {
    void deleteAllByWorkerId(Long id);
}
