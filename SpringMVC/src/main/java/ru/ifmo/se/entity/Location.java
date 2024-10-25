package ru.ifmo.se.entity;

import ru.ifmo.se.entity.operation.LocationOperation;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "location", schema = "s372799")
@Getter
@NoArgsConstructor
@Setter
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    private Float x;

    private long y;

    @NotNull
    private Long z;

    @OneToOne(mappedBy = "location")
    private Person person;

    @OneToOne(mappedBy = "town")
    private Address address;

    @OneToMany(mappedBy = "location", cascade = CascadeType.REMOVE)
    private List<LocationOperation> operations;
}
