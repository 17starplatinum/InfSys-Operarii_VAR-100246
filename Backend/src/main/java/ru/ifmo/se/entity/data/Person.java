package ru.ifmo.se.entity.data;

import ru.ifmo.se.entity.user.User;

import com.fasterxml.jackson.annotation.JsonBackReference;
import ru.ifmo.se.entity.data.enumerated.Color;
import ru.ifmo.se.entity.data.enumerated.Country;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "person", schema = "s372799")
@Getter
@NoArgsConstructor
@Setter
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private long id;

    @NotNull(message = "Eye color CANNOT be null")
    @Enumerated(EnumType.STRING)
    @Column(name = "eye_color", nullable = false)
    private Color eyeColor;

    @Enumerated(EnumType.STRING)
    @Column(name = "hair_color")
    private Color hairColor;

    @NotNull(message = "Location CANNOT be null")
    @OneToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.PERSIST})
    @JoinColumn(name = "location_id", referencedColumnName = "id", nullable = false)
    private Location location;

    @Column(name = "birthday")
    private LocalDate birthday;

    @NotNull(message = "Weight CANNOT be null")
    @Min(value = 1, message = "Weight must be a natural value")
    @Column(name = "weight", nullable = false)
    private Double weight;

    @NotNull(message = "Nationality CANNOT be null")
    @Enumerated(EnumType.STRING)
    @Column(name = "nationality", nullable = false)
    private Country nationality;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "owner_id")
    @JsonBackReference
    private User owner;
}
