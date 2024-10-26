package ru.ifmo.se.dto;

import ru.ifmo.se.entity.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.enumerated.Color;
import ru.ifmo.se.entity.enumerated.Country;

@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class PersonDTO {
    private Long id;

    @NotNull
    private Color eyeColor;


    private Color hairColor;

    @NotNull
    private Location location; //Поле не может быть null

    private java.time.LocalDate birthday; //Поле может быть null

    @Min(1)
    @NotNull
    private Double weight; //Поле не может быть null, Значение поля должно быть больше 0

    @NotNull
    private Country nationality; //Поле не может быть null
}
