package ru.ifmo.se.entity;

import ru.ifmo.se.entity.operation.CoordinatesOperation;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

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

    @OneToMany(mappedBy = "coordinates")
    private List<Worker> workers;

    @OneToMany(mappedBy = "coordinates", cascade = CascadeType.REMOVE)
    private List<CoordinatesOperation> operations;
}
