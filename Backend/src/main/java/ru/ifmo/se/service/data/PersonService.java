package ru.ifmo.se.service.data;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.dto.data.PersonDTO;
import ru.ifmo.se.entity.data.Location;
import ru.ifmo.se.entity.data.Person;
import ru.ifmo.se.entity.data.audit.AuditOperation;
import ru.ifmo.se.exception.EntityDeletionException;
import ru.ifmo.se.repository.data.PersonRepository;
import ru.ifmo.se.service.data.audit.AuditService;
import ru.ifmo.se.service.user.UserService;
import ru.ifmo.se.util.EntityMapper;
import ru.ifmo.se.util.pagination.PaginationHandler;

@Service
@RequiredArgsConstructor
public class PersonService {

    private final PersonRepository personRepository;
    private final AuditService auditService;
    private final UserService userService;
    private final EntityMapper entityMapper;
    private final PaginationHandler paginationHandler;
    private final LocationService locationService;
    private static final String NOT_FOUND_MESSAGE = "Person not found";

    @Transactional(readOnly = true)
    public Page<PersonDTO> getAllPeople(int page, int size, String sortBy, String sortDirection) {
        Pageable pageable = paginationHandler.createPageable(page, size, sortBy, sortDirection);
        return personRepository.findAll(pageable).map(entityMapper::toPersonDTO);
    }

    @Transactional(readOnly = true)
    public PersonDTO getPersonById(Long id) {
        Person person = personRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        return entityMapper.toPersonDTO(person);
    }

    @Transactional
    public PersonDTO createPerson(PersonDTO personDTO) {
        Location location = locationService.createOrUpdateLocationForObjects(personDTO.getLocation());
        Person person = entityMapper.toPersonEntity(personDTO, location);
        person.setCreatedBy(userService.getCurrentUser());
        Person savedPerson = personRepository.save(person);
        auditService.auditPerson(savedPerson, AuditOperation.CREATE);
        return entityMapper.toPersonDTO(savedPerson);
    }

    @Transactional
    public PersonDTO updatePerson(Long id, PersonDTO personDTO) {
        Person person = personRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        if (userService.cantModifyEntity(person)) {
            throw new IllegalArgumentException("You are not allowed to modify this Person.");
        }
        person.setEyeColor(personDTO.getEyeColor());
        person.setHairColor(personDTO.getHairColor());
        person.setBirthday(personDTO.getBirthday());
        person.setLocation(locationService.createOrUpdateLocationForObjects(personDTO.getLocation()));
        person.setWeight(personDTO.getWeight());
        person.setNationality(personDTO.getNationality());

        Person savedPerson = personRepository.save(person);
        auditService.auditPerson(savedPerson, AuditOperation.UPDATE);
        return entityMapper.toPersonDTO(savedPerson);
    }

    @Transactional
    public Person createOrUpdatePersonForWorker(PersonDTO personDTO) {
        Location location = locationService.createOrUpdateLocationForObjects(personDTO.getLocation());
        if (personDTO.getId() != null) {
            Person person = personRepository.findById(personDTO.getId()).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
            if (userService.cantModifyEntity(person)) {
                throw new IllegalArgumentException("You are not allowed to modify this Person.");
            }
            person.setEyeColor(personDTO.getEyeColor());
            person.setHairColor(personDTO.getHairColor());
            person.setBirthday(personDTO.getBirthday());
            person.setLocation(location);
            person.setWeight(personDTO.getWeight());
            person.setNationality(personDTO.getNationality());

            Person savedPerson = personRepository.save(person);
            auditService.auditPerson(savedPerson, AuditOperation.UPDATE);
            return savedPerson;
        } else {
            Person person = entityMapper.toPersonEntity(personDTO, location);
            person.setCreatedBy(userService.getCurrentUser());
            Person savedPerson = personRepository.save(person);
            auditService.auditPerson(savedPerson, AuditOperation.CREATE);
            return savedPerson;
        }
    }

    @Transactional
    public void deletePerson(Long id) {
        Person person = personRepository.findById(id).orElseThrow(() -> new IllegalArgumentException(NOT_FOUND_MESSAGE));
        if (userService.cantModifyEntity(person)) {
            throw new IllegalArgumentException("You are not allowed to delete this Person.");
        }
        if (!person.getWorkers().isEmpty()) {
            throw new EntityDeletionException("Cannot delete this Person since it is linked to a Worker.");
        }

        auditService.deletePersonAudits(id);
        personRepository.delete(person);
    }
}
