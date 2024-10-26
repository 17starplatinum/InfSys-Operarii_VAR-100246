package ru.ifmo.se.entity.operation;

import ru.ifmo.se.entity.Organization;
import ru.ifmo.se.entity.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "organization_operation", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class OrganizationOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "operation", nullable = false)
    private OperationState operation;

    @Column(name = "operation_time", nullable = false)
    private LocalDateTime operationTime;
}
