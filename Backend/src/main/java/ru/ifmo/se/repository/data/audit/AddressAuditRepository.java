package ru.ifmo.se.repository.data.audit;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.audit.AddressAudit;

@Repository
public interface AddressAuditRepository extends CrudRepository<AddressAudit, Long> {
    void deleteAllByAddressId(Long id);
}