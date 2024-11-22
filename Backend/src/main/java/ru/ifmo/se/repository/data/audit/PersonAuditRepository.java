package ru.ifmo.se.repository.data.audit;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.audit.PersonAudit;

@Repository
public interface PersonAuditRepository extends CrudRepository<PersonAudit, Long> {
    void deleteAllByPersonId(Long id);
}
