package ru.ifmo.se.entity.data;

import jakarta.annotation.Nullable;
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
import java.util.Objects;

@Entity
@Table(name = "coordinates", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Coordinates implements Creatable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Max(value = 990)
    private double x;

    @Max(value = 27)
    private int y;

    @OneToMany(mappedBy = "coordinates")
    private List<Worker> workers;

    @ManyToOne
    @JoinColumn
    private User createdBy;

    @OneToMany(mappedBy = "coordinates")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<CoordinatesAudit> audits;


    @Override
    public boolean equals(@Nullable Object o) {
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;
        Coordinates that = (Coordinates) o;
        return x == that.x && y == that.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
}
