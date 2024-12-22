package ru.ifmo.se.util;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.ifmo.se.dto.data.*;
import ru.ifmo.se.dto.info.ImportHistoryDTO;
import ru.ifmo.se.dto.user.UserDTO;
import ru.ifmo.se.entity.data.*;
import ru.ifmo.se.entity.data.audit.*;
import ru.ifmo.se.entity.info.ImportHistory;
import ru.ifmo.se.entity.info.ImportStatus;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.service.data.*;
import ru.ifmo.se.service.user.UserService;

import java.time.LocalDateTime;

@Component
public class EntityMapper {
    public UserService userService;
    public PersonService personService;
    public OrganizationService organizationService;
    public AddressService addressService;
    public LocationService locationService;
    public CoordinatesService coordinatesService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setPersonService(PersonService personService) {
        this.personService = personService;
    }

    @Autowired
    public void setOrganizationService(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @Autowired
    public void setAddressService(AddressService addressService) {
        this.addressService = addressService;
    }

    @Autowired
    public void setLocationService(LocationService locationService) {
        this.locationService = locationService;
    }

    @Autowired
    public void setCoordinatesService(CoordinatesService coordinatesService) {
        this.coordinatesService = coordinatesService;
    }

    public WorkerDTO toWorkerDTO(Worker worker) {
        WorkerDTO workerDTO = new WorkerDTO();
        workerDTO.setId(worker.getId());
        workerDTO.setName(worker.getName());
        workerDTO.setCoordinates(toCoordinatesDTO(worker.getCoordinates()));
        workerDTO.setCreationDate(worker.getCreationDate());
        workerDTO.setOrganization((worker.getOrganization() == null) ? null : toOrganizationDTO(worker.getOrganization()));
        workerDTO.setRating(worker.getRating());
        workerDTO.setSalary(worker.getSalary());
        workerDTO.setPosition(worker.getPosition());
        workerDTO.setStatus(worker.getStatus());
        workerDTO.setPerson(toPersonDTO(worker.getPerson()));
        workerDTO.setCreatedBy(worker.getCreatedBy());
        return workerDTO;
    }

    public @NotNull CoordinatesDTO toCoordinatesDTO(Coordinates coordinates) {
        return new CoordinatesDTO(
                coordinates.getId(),
                coordinates.getX(),
                coordinates.getY(),
                coordinates.getCreatedBy()
        );
    }

    public @NotNull PersonDTO toPersonDTO(Person person) {
        return new PersonDTO(
                person.getId(),
                person.getEyeColor(),
                person.getHairColor(),
                toLocationDTO(person.getLocation()),
                person.getBirthday(),
                person.getWeight(),
                person.getNationality(),
                person.getCreatedBy()
        );
    }

    public OrganizationDTO toOrganizationDTO(Organization organization) {
        return new OrganizationDTO(
                organization.getId(),
                toAddressDTO(organization.getOfficialAddress()),
                organization.getAnnualTurnover(),
                organization.getEmployeesCount(),
                organization.getFullName(),
                organization.getOrganizationType(),
                toAddressDTO(organization.getPostalAddress()),
                organization.getCreatedBy()
        );
    }

    public @NotNull LocationDTO toLocationDTO(Location location) {
        return new LocationDTO(
                location.getId(),
                location.getX(),
                location.getY(),
                location.getZ(),
                location.getCreatedBy()
        );
    }

    public @NotNull AddressDTO toAddressDTO(Address address) {
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setId(address.getId());
        addressDTO.setZipCode(address.getZipCode());
        if(address.getTown() == null) {
            addressDTO.setTown(null);
        } else {
            addressDTO.setTown(toLocationDTO(address.getTown()));
        }
        addressDTO.setCreatedBy(address.getCreatedBy());
        return addressDTO;
    }

    public UserDTO toUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setRole(user.getRole());
        userDTO.setAdminRequestStatus(user.getAdminRequestStatus());
        return userDTO;
    }

    public Worker toWorkerEntity(WorkerDTO workerDTO, Coordinates coordinates, Organization organization, Person person) {
        Worker worker = new Worker();
        worker.setName(workerDTO.getName());
        worker.setCoordinates(coordinates);
        worker.setOrganization(organization);
        worker.setRating(workerDTO.getRating());
        worker.setSalary(workerDTO.getSalary());
        worker.setPosition(workerDTO.getPosition());
        worker.setStatus(workerDTO.getStatus());
        worker.setPerson(person);
        worker.setCreationDate(workerDTO.getCreationDate() != null ? workerDTO.getCreationDate() : LocalDateTime.now());
        return worker;
    }

    public Coordinates toCoordinatesEntity(CoordinatesDTO coordinatesDTO) {
        Coordinates coordinates = new Coordinates();
        coordinates.setX(coordinatesDTO.getX());
        coordinates.setY(coordinatesDTO.getY());
        return coordinates;
    }

    public Location toLocationEntity(LocationDTO locationDTO) {
        Location location = new Location();
        location.setX(locationDTO.getX());
        location.setY(locationDTO.getY());
        location.setZ(locationDTO.getZ());
        return location;
    }

    public Address toAddressEntity(AddressDTO addressDTO, Location town) {
        Address address = new Address();
        address.setZipCode(addressDTO.getZipCode());
        address.setTown(town);
        return address;
    }

    public Organization toOrganizationEntity(OrganizationDTO organizationDTO, Address officialAddress, Address postalAddress) {
        Organization organization = new Organization();
        organization.setOfficialAddress(officialAddress);
        organization.setAnnualTurnover(organizationDTO.getAnnualTurnover());
        organization.setEmployeesCount(organizationDTO.getEmployeesCount());
        organization.setFullName(organizationDTO.getFullName());
        organization.setOrganizationType(organizationDTO.getOrganizationType());
        organization.setPostalAddress(postalAddress);
        return organization;
    }

    public Person toPersonEntity(PersonDTO personDTO, Location location) {
        Person person = new Person();
        person.setEyeColor(personDTO.getEyeColor());
        person.setHairColor(personDTO.getHairColor());
        person.setLocation(location);
        person.setBirthday(personDTO.getBirthday());
        person.setWeight(personDTO.getWeight());
        person.setNationality(personDTO.getNationality());
        return person;
    }

    public WorkerAudit toWorkerAudit(Worker worker, AuditOperation auditOperation) {
        WorkerAudit workerAudit = new WorkerAudit();
        workerAudit.setWorker(worker);
        workerAudit.setUser(userService.getCurrentUser());
        workerAudit.setOperation(auditOperation);
        workerAudit.setOperationDateAndTime(LocalDateTime.now());
        return workerAudit;
    }

    public CoordinatesAudit toCoordinatesAudit(Coordinates coordinates, AuditOperation auditOperation) {
        CoordinatesAudit coordinatesAudit = new CoordinatesAudit();
        coordinatesAudit.setCoordinates(coordinates);
        coordinatesAudit.setUser(userService.getCurrentUser());
        coordinatesAudit.setOperation(auditOperation);
        coordinatesAudit.setOperationDateAndTime(LocalDateTime.now());
        return coordinatesAudit;
    }

    public OrganizationAudit toOrganizationAudit(Organization organization, AuditOperation auditOperation) {
        OrganizationAudit organizationAudit = new OrganizationAudit();
        organizationAudit.setOrganization(organization);
        organizationAudit.setUser(userService.getCurrentUser());
        organizationAudit.setOperation(auditOperation);
        organizationAudit.setOperationDateAndTime(LocalDateTime.now());
        return organizationAudit;
    }

    public PersonAudit toPersonAudit(Person person, AuditOperation auditOperation) {
        PersonAudit personAudit = new PersonAudit();
        personAudit.setPerson(person);
        personAudit.setUser(userService.getCurrentUser());
        personAudit.setOperation(auditOperation);
        personAudit.setOperationDateAndTime(LocalDateTime.now());
        return personAudit;
    }

    public LocationAudit toLocationAudit(Location location, AuditOperation auditOperation) {
        LocationAudit locationAudit = new LocationAudit();
        locationAudit.setLocation(location);
        locationAudit.setUser(userService.getCurrentUser());
        locationAudit.setOperation(auditOperation);
        locationAudit.setOperationDateAndTime(LocalDateTime.now());
        return locationAudit;
    }

    public AddressAudit toAddressAudit(Address address, AuditOperation auditOperation) {
        AddressAudit addressAudit = new AddressAudit();
        addressAudit.setAddress(address);
        addressAudit.setUser(userService.getCurrentUser());
        addressAudit.setOperation(auditOperation);
        addressAudit.setOperationDateAndTime(LocalDateTime.now());
        return addressAudit;
    }

    public ImportHistoryDTO toImportHistoryDTO(ImportHistory importHistory) {
        ImportHistoryDTO importOperationDTO = new ImportHistoryDTO();
        importOperationDTO.setId(importHistory.getId());
        importOperationDTO.setStatus(importHistory.getStatus());
        importOperationDTO.setTimestamp(importHistory.getTimestamp());
        importOperationDTO.setAddedObjectsCount(importHistory.getAddedObjectsCount());
        importOperationDTO.setAddedObjectsCount(importHistory.getAddedObjectsCount());
        return importOperationDTO;
    }

    public ImportHistory toImportHistoryEntity(User user, ImportStatus status, int addedObjects) {
        ImportHistory importHistory = new ImportHistory();
        importHistory.setStatus(status);
        importHistory.setUser(user);
        importHistory.setTimestamp(LocalDateTime.now());
        importHistory.setAddedObjectsCount(addedObjects);
        return importHistory;
    }
}
