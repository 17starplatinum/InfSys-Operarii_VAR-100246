package ru.ifmo.se.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

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

    @OneToOne
    @JoinColumn(name = "update_id", referencedColumnName = "id")
    private UpdateTracker update;
}
