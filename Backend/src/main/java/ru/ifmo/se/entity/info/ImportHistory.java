package ru.ifmo.se.entity.info;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.ifmo.se.entity.user.User;

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

    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private Integer totalObjectsCount;

    private Integer addedObjectsCount;
}
