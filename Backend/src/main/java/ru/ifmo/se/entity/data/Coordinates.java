package ru.ifmo.se.entity.data;

import ru.ifmo.se.entity.user.User;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "coordinates", schema = "s372799")
@Getter
@Setter
public class Coordinates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private long id;

    @NotNull(message = "Let's make this field not nullable, just for my sake.")
    @Max(value = 990, message = "Abscissa must not be greater than 990")
    @Column(name = "x", nullable = false)
    private double x;

    @NotNull(message = "Let's make this field not nullable, just for my sake.")
    @Max(value = 12, message = "Ordinate must not be greater than 12")
    @Column(name = "y", nullable = false)
    private int y;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "owner_id")
    @JsonBackReference
    private User owner;
}
