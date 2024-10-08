package ru.ifmo.se.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "coordinates", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Coordinates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Max(990)
    private double x;

    @Max(12)
    private int y;

    @OneToOne
    @JoinColumn(name = "update_id", referencedColumnName = "id")
    private UpdateTracker update;
}
