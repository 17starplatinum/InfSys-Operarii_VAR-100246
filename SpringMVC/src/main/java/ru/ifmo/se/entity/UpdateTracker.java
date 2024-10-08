package ru.ifmo.se.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "update_tracker", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class UpdateTracker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
