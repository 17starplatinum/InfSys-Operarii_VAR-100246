package ru.ifmo.se.service.data.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.entity.data.*;
import ru.ifmo.se.entity.data.audit.*;
import ru.ifmo.se.repository.data.audit.*;
import ru.ifmo.se.util.EntityMapper;

@Service
public class AuditService {

    private WorkerAuditRepository workerAuditRepository;
    private AddressAuditRepository addressAuditRepository;
    private CoordinatesAuditRepository coordinatesAuditRepository;
    private LocationAuditRepository locationAuditRepository;
    private OrganizationAuditRepository organizationAuditRepository;
    private PersonAuditRepository personAuditRepository;
    private EntityMapper entityMapper;

    @Autowired
    public void setWorkerAuditRepository(WorkerAuditRepository workerAuditRepository) {
        this.workerAuditRepository = workerAuditRepository;
    }

    @Autowired
    public void setAddressAuditRepository(AddressAuditRepository addressAuditRepository) {
        this.addressAuditRepository = addressAuditRepository;
    }

    @Autowired
    public void setCoordinatesAuditRepository(CoordinatesAuditRepository coordinatesAuditRepository) {
        this.coordinatesAuditRepository = coordinatesAuditRepository;
    }

    @Autowired
    public void setLocationAuditRepository(LocationAuditRepository locationAuditRepository) {
        this.locationAuditRepository = locationAuditRepository;
    }

    @Autowired
    public void setOrganizationAuditRepository(OrganizationAuditRepository organizationAuditRepository) {
        this.organizationAuditRepository = organizationAuditRepository;
    }

    @Autowired
    public void setPersonAuditRepository(PersonAuditRepository personAuditRepository) {
        this.personAuditRepository = personAuditRepository;
    }

    @Autowired
    public void setEntityMapper(EntityMapper entityMapper) {
        this.entityMapper = entityMapper;
    }

    @Transactional
    public void auditWorker(Worker worker, AuditOperation auditOperation) {
        WorkerAudit workerAudit = entityMapper.toWorkerAudit(worker, auditOperation);
        workerAuditRepository.save(workerAudit);
    }

    @Transactional
    public void auditAddress(Address address, AuditOperation auditOperation) {
        AddressAudit addressAudit = entityMapper.toAddressAudit(address, auditOperation);
        addressAuditRepository.save(addressAudit);
    }

    @Transactional
    public void auditCoordinates(Coordinates coordinates, AuditOperation auditOperation) {
        CoordinatesAudit coordinatesAudit = entityMapper.toCoordinatesAudit(coordinates, auditOperation);
        coordinatesAuditRepository.save(coordinatesAudit);
    }

    @Transactional
    public void auditLocation(Location location, AuditOperation auditOperation) {
        LocationAudit locationAudit = entityMapper.toLocationAudit(location, auditOperation);
        locationAuditRepository.save(locationAudit);
    }

    @Transactional
    public void auditOrganization(Organization organization, AuditOperation auditOperation) {
        OrganizationAudit organizationAudit = entityMapper.toOrganizationAudit(organization, auditOperation);
        organizationAuditRepository.save(organizationAudit);
    }

    @Transactional
    public void auditPerson(Person person, AuditOperation auditOperation) {
        PersonAudit personAudit = entityMapper.toPersonAudit(person, auditOperation);
        personAuditRepository.save(personAudit);
    }

    @Transactional
    public void deleteWorkerAudits(Long workerId) {
        workerAuditRepository.deleteAllByWorkerId(workerId);
    }

    @Transactional
    public void deleteAddressAudits(Long addressId) {
        addressAuditRepository.deleteAllByAddressId(addressId);
    }

    @Transactional
    public void deleteCoordinatesAudits(Long coordinatesId) {
        coordinatesAuditRepository.deleteAllByCoordinatesId(coordinatesId);
    }

    @Transactional
    public void deleteLocationAudits(Long locationId) {
        locationAuditRepository.deleteAllByLocationId(locationId);
    }

    @Transactional
    public void deleteOrganizationAudits(Long organizationId) {
        organizationAuditRepository.deleteAllByOrganizationId(organizationId);
    }

    @Transactional
    public void deletePersonAudits(Long personId) {
        personAuditRepository.deleteAllByPersonId(personId);
    }
}
