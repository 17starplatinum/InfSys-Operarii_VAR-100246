package ru.ifmo.se.entity.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import ru.ifmo.se.entity.data.audit.CoordinatesAudit;
import ru.ifmo.se.entity.user.User;

import java.util.List;

@Entity
@Table(name = "coordinates", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Coordinates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Max(value = 990)
    @Column(name = "x")
    private double x;

    @Max(value = 12)
    @Column(name = "y")
    private int y;

    @OneToMany(mappedBy = "coordinates")
    private List<Worker> workers;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "coordinates")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<CoordinatesAudit> audits;
}
