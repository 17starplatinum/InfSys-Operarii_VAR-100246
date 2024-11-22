package ru.ifmo.se.dto.data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.data.enumerated.Color;
import ru.ifmo.se.entity.data.enumerated.Country;
import ru.ifmo.se.entity.user.User;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonDTO {
    private Long id;

    @NotNull
    private Color eyeColor;

    private Color hairColor;

    @NotNull
    private LocationDTO location;

    private LocalDate birthday;

    @Min(1)
    @NotNull
    private Double weight;

    @NotNull
    private Country nationality;

    private User createdBy;
}
