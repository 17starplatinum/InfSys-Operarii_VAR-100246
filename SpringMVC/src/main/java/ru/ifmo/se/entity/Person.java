package ru.ifmo.se.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

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
    @JoinColumn(name = "location_id", referencedColumnName = "id")
    private Location location;

    private LocalDate birthday;

    @NotNull
    @Min(1)
    private Double weight;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Country nationality;

    @OneToOne
    @JoinColumn(name = "update_id", referencedColumnName = "id")
    private UpdateTracker update;
}
