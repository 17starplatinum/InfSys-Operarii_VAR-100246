package ru.ifmo.se.entity;

import ru.ifmo.se.entity.enumerated.Color;
import ru.ifmo.se.entity.enumerated.Country;
import ru.ifmo.se.entity.operation.PersonOperation;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "human", schema = "s372799")
@Getter
@NoArgsConstructor
@Setter
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Color eyeColor;

    @Enumerated(EnumType.STRING)
    private Color hairColor;

    @NotNull
    @OneToOne
    @JoinColumn(name = "location_id")
    private Location location;

    private LocalDate birthday;

    @NotNull
    @Min(1)
    private Double weight;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Country nationality;

    @OneToOne(mappedBy = "person")
    private Worker worker;

    @OneToMany(mappedBy = "person", cascade = CascadeType.REMOVE)
    private List<PersonOperation> operations;
}
