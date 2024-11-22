package ru.ifmo.se.dto.data.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.data.enumerated.Color;
import ru.ifmo.se.entity.data.enumerated.Country;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonFilterCriteria {
    private Color hairColor;
    private Color eyeColor;
    private Country country;
}
