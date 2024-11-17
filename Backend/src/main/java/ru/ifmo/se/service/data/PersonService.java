package ru.ifmo.se.service.data;

import ru.ifmo.se.dto.data.PersonDTOwID;
import ru.ifmo.se.entity.data.*;
import ru.ifmo.se.entity.data.enumerated.Color;
import ru.ifmo.se.entity.data.enumerated.Country;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Person;
import ru.ifmo.se.dto.data.PersonDTOwID;
import ru.ifmo.se.exception.ResourceNotFoundException;
import ru.ifmo.se.repository.data.PersonRepository;
import ru.ifmo.se.repository.data.LocationRepository;

import org.hibernate.HibernateException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.ifmo.se.util.DateFormatConverter;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class PersonService {

    private final PersonRepository personRepository;
    private final LocationRepository locationRepository;

    @Transactional
    public Person savePerson(PersonDTOwID personDTOwID, User user) {
        try {
            Person person = new Person();
            person.setEyeColor(Color.valueOf(personDTOwID.getEyeColor()));

            try {
                person.setHairColor(Color.valueOf(personDTOwID.getHairColor()));
            } catch (Exception e) {
                person.setHairColor(null);
            }

            if (personDTOwID.getLocationWrapper().getLocationId() != null) {
                Location existingLocation = personDTOwID.getLocationWrapper().getLocation();
                person.setLocation(existingLocation);
            } else if (personDTOwID.getLocationWrapper().getLocation() != null) {
                Location newLocation = personDTOwID.getLocationWrapper().getLocation();
                newLocation.setOwner(user);
                personRepository.save(person);
                person.setLocation(newLocation);
            }

            try {
                person.setBirthday(LocalDate.parse(personDTOwID.getBirthday()));
            } catch (Exception e) {
                person.setBirthday(null);
            }

            person.setWeight(personDTOwID.getWeight());
            person.setNationality(Country.valueOf(personDTOwID.getNationality()));
            personRepository.save(person);
            return person;
        } catch (HibernateException e) {
            throw new RuntimeException("Error while saving person", e);
        }
    }

    public List<Person> getAllPeopleByUser(User user) {
        return personRepository.findByOwner(user);
    }

    public Person getPersonById(Long id) {
        try {
            Person person = personRepository.findById(id);

            if (person == null) {
                throw new ResourceNotFoundException("Person with id " + id + " not found");
            }
            return person;
        } catch (Exception e) {
            throw new ResourceNotFoundException("There's no such person with id = " + id);
        }
    }

    @Transactional
    public Person updatePerson(Person person, PersonDTOwID personDTOwID, User user) {
        try {
            if(person == null) {
                throw new IllegalArgumentException("Person with this id not found");
            }
            person.setEyeColor(Color.valueOf(personDTOwID.getEyeColor()));
            if(personDTOwID.getHairColor() == null || personDTOwID.getHairColor().isEmpty()) {
                person.setHairColor(null);
            } else {
                person.setHairColor(Color.valueOf(personDTOwID.getHairColor()));
            }

            Location location = personDTOwID.getLocationWrapper().getLocation();
            if(location != null) {
                locationRepository.update(location);
                person.setLocation(location);
            }

            try {
                String formattedBirthday = DateFormatConverter.convertDate(personDTOwID.getBirthday());
                person.setBirthday(LocalDate.parse(formattedBirthday));
            } catch (Exception ignored) {}
            person.setWeight(personDTOwID.getWeight());
            person.setNationality(Country.valueOf(personDTOwID.getNationality()));
            personRepository.update(person);
            return person;
        } catch (HibernateException e) {
            throw new RuntimeException("Error while updating person", e);
        }
    }

    @Transactional
    public void deletePersonById(Long id) {
        Person person = personRepository.findById(id);
        if(person.getLocation() != null) {
            Location location = person.getLocation();
            person.setLocation(null);
            locationRepository.delete(location);
        }
        personRepository.delete(person);
    }
}
