package ru.ifmo.se.entity.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import ru.ifmo.se.entity.data.audit.WorkerAudit;
import ru.ifmo.se.entity.data.enumerated.Position;
import ru.ifmo.se.entity.data.enumerated.Status;
import ru.ifmo.se.entity.user.User;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "worker", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Worker implements Creatable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 1)
    private String name;

    @NotNull
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "coordinates_id", nullable = false)
    private Coordinates coordinates;

    @Column
    private LocalDateTime creationDate;

    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Positive
    private Double salary;

    @Positive
    private int rating;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Position position;

    @Enumerated(EnumType.STRING)
    private Status status;

    @NotNull
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn
    private User createdBy;

    @OneToMany(mappedBy = "worker")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<WorkerAudit> audits;
}
