package ru.ifmo.se.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "address", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    private String zipCode;

    @OneToOne
    @JoinColumn(name = "location_id", referencedColumnName = "id")
    private Location town;

    @OneToOne
    @JoinColumn(name = "update_id", referencedColumnName = "id")
    private UpdateTracker update;
}
