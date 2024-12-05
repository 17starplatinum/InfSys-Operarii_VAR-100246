package ru.ifmo.se.entity.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.lang.Nullable;
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
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @Size(min = 1, message = "Name CANNOT be blank")
    private String name;

    @NotNull
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "coordinates_id", nullable = false)
    private Coordinates coordinates;

    @Column(name = "creation_date", nullable = false)
    private LocalDateTime creationDate = LocalDateTime.now();

    @Nullable
    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Min(value = 0, message = "Salary must be a natural value")
    private Double salary;

    @Min(value = 0, message = "Rating must be a natural value")
    private int rating;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Position position;

    @Nullable
    @Enumerated(EnumType.STRING)
    private Status status;

    @NotNull
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "person_id", referencedColumnName = "id")
    private Person person;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "worker")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<WorkerAudit> audits;
}
