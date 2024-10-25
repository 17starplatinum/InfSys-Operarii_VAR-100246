package ru.ifmo.se.dto.criteria;

import ru.ifmo.se.entity.enumerated.Color;
import ru.ifmo.se.entity.enumerated.Country;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonFilterCriteria {
    private Color eyeColor;
    private Color hairColor;
    private Country nationality;
}
