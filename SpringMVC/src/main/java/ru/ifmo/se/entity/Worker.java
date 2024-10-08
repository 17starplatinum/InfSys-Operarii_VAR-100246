package ru.ifmo.se.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "worker", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @Column(name = "name")
    private String name;

    @NotNull
    @OneToOne
    @JoinColumn(name = "coordinate_id", referencedColumnName = "id")
    private Coordinates coordinates;

    @NotNull
    private LocalDateTime creationDate;

    @OneToOne
    @JoinColumn(name = "organization_id", referencedColumnName = "id")
    private Organization organization;

    @Min(1)
    private Double salary;

    @Min(1)
    private int rating;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Position position;

    @Enumerated(EnumType.STRING)
    private Status status;

    @NotNull
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "human_id", referencedColumnName = "id")
    private Person person;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "creator_id", referencedColumnName = "id")
    private User creator;

    @OneToOne
    @JoinColumn(name = "update_id", referencedColumnName = "id")
    private UpdateTracker update;
}
