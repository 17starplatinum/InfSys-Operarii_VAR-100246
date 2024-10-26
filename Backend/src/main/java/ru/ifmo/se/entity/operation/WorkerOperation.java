package ru.ifmo.se.entity.operation;

import ru.ifmo.se.entity.Worker;
import ru.ifmo.se.entity.User;
import ru.ifmo.se.entity.operation.OperationState;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "worker_operation", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class WorkerOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "operation", nullable = false)
    private OperationState operation;

    @Column(name = "operation_time", nullable = false)
    private LocalDateTime operationTime;
}
