package ru.ifmo.se.repository.data.audit;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.audit.OrganizationAudit;

@Repository
public interface OrganizationAuditRepository extends CrudRepository<OrganizationAudit, Long> {
    void deleteAllByOrganizationId(Long id);
}