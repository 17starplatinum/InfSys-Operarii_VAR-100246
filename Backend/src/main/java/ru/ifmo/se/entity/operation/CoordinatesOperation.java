package ru.ifmo.se.entity.operation;

import ru.ifmo.se.entity.Coordinates;
import ru.ifmo.se.entity.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "coordinates_operation", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class CoordinatesOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "coordinates_id", nullable = false)
    private Coordinates coordinates;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "operation", nullable = false)
    private OperationState operation;

    @Column(name = "operation_time", nullable = false)
    private LocalDateTime operationTime;
}
