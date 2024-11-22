package ru.ifmo.se.entity.data.audit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.ifmo.se.entity.data.Person;
import ru.ifmo.se.entity.user.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "person_audit", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class PersonAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "operation", nullable = false)
    private AuditOperation operation;

    @Column(name = "operation_date_and_time", nullable = false)
    private LocalDateTime operationDateAndTime;
}
