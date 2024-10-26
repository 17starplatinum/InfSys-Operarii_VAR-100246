package ru.ifmo.se.entity;

import ru.ifmo.se.entity.enumerated.Position;
import ru.ifmo.se.entity.enumerated.Status;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.operation.WorkerOperation;

import java.time.LocalDateTime;
import java.util.List;

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
    @Size(min = 1)
    @Column(name = "name")
    private String name;

    @NotNull
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "coordinates_id")
    private Coordinates coordinates;

    @Column(nullable = false)
    private LocalDateTime creationDate = LocalDateTime.now();

    @OneToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Min(1)
    private Double salary;

    @Min(1)
    private int rating;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Position position;

    @Enumerated(EnumType.STRING)
    private Status status;

    @NotNull
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "human_id")
    private Person person;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @OneToMany(mappedBy = "worker", cascade = CascadeType.REMOVE)
    private List<WorkerOperation> operations;
}
