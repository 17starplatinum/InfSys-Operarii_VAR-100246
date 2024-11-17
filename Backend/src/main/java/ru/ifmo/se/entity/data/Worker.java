package ru.ifmo.se.entity.data;

import lombok.Data;
import ru.ifmo.se.entity.data.enumerated.Position;
import ru.ifmo.se.entity.data.enumerated.Status;
import ru.ifmo.se.entity.user.User;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "worker", schema = "s372799")
@NamedNativeQueries({
        @NamedNativeQuery(
                name = "Worker.removeWorkerByPerson",
                query = "CALL remove_worker_by_person(:personId)"
        ),
        @NamedNativeQuery(
                name = "Worker.fireWorkerFromOrganization",
                query = "CALL fire_worker_from_organization(:workerId)"
        ),
        @NamedNativeQuery(
                name = "Worker.transferWorkerToAnotherOrganization",
                query = "CALL transfer_worker_to_another_organization(:workerId, :organizationId)"
        )
})
@Data
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private long id;

    @NotNull(message = "Name CANNOT be null")
    @Size(min = 1, message = "Name CANNOT be blank")
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull(message = "Coordinates CANNOT be null")
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH})
    @JoinColumn(name = "coordinates_id", referencedColumnName = "id", nullable = false)
    private Coordinates coordinates;

    @Column(name = "creation_date", nullable = false)
    private LocalDateTime creationDate = LocalDateTime.now();

    @OneToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.PERSIST})
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Min(value = 1, message = "Salary must be a natural value")
    @Column(name = "salary")
    private Double salary;

    @Min(value = 1, message = "Rating must be a natural value")
    @Column(name = "rating")
    private int rating;

    @NotNull(message = "Position cannot be null")
    @Column(name = "position", nullable = false)
    @Enumerated(EnumType.STRING)
    private Position position;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @NotNull(message = "Person CANNOT be null")
    @OneToOne(cascade = {CascadeType.DETACH, CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "human_id", referencedColumnName = "id", nullable = false)
    private Person person;

    @NotNull(message = "Owner CANNOT be null")
    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "owner_id", referencedColumnName = "id", nullable = false)
    private User owner;

    @ManyToOne
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by_id")
    private User updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
