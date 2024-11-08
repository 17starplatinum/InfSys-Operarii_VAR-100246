package ru.ifmo.se.dto.data.wrappers;

import ru.ifmo.se.entity.data.Person;

import jakarta.validation.Valid;
import lombok.Data;

@Data
public class PersonWrapper {
    private Long personId;
    @Valid
    private Person person;
}
