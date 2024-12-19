package ru.ifmo.se.entity.info;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.ifmo.se.entity.user.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "import_history", schema = "s372799")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImportHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private ImportStatus status;

    private LocalDateTime timestamp;

    private Integer addedObjectsCount;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;
}
