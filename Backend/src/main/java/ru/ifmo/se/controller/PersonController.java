package ru.ifmo.se.controller;

import ru.ifmo.se.dto.data.PersonDTOwID;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.Person;
import ru.ifmo.se.service.data.PersonService;
import ru.ifmo.se.util.DTOUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/people")
public class PersonController {
    private final PersonService personService;
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public ResponseEntity<List<PersonDTOwID>> getUserPeople() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();

            List<Person> people = personService.getAllPeopleByUser(user);
            List<PersonDTOwID> response = people.stream().map(DTOUtil::convertToPersonDTOwIDResponse).collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();
        }
        return null;
    }
}