package ru.ifmo.se.entity.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import ru.ifmo.se.entity.data.audit.LocationAudit;
import ru.ifmo.se.entity.user.User;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "location", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Location implements Creatable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Float x;

    @Column
    private long y;

    @NotNull
    @Column(nullable = false)
    private Long z;

    @OneToMany(mappedBy = "location")
    private List<Person> people;

    @OneToMany(mappedBy = "town")
    private List<Address> addresses;

    @ManyToOne
    @JoinColumn
    private User createdBy;

    @OneToMany(mappedBy = "location")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<LocationAudit> audits;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Location location = (Location) o;
        return x.equals(location.x) &&
                y == location.y &&
                z.equals(location.z);
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y ,z);
    }
}
