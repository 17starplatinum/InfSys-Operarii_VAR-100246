package ru.ifmo.se.entity.data;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import ru.ifmo.se.dto.data.CoordinatesDTO;
import ru.ifmo.se.entity.data.audit.PersonAudit;
import ru.ifmo.se.entity.data.enumerated.Color;
import ru.ifmo.se.entity.data.enumerated.Country;
import ru.ifmo.se.entity.user.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "person", schema = "s372799")
@Getter
@NoArgsConstructor
@Setter
public class Person implements Creatable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Color eyeColor;

    @Enumerated(EnumType.STRING)
    private Color hairColor;

    @NotNull
    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    private LocalDate birthday;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Double weight;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Country nationality;

    @OneToMany(mappedBy = "person")
    private List<Worker> workers;

    @ManyToOne
    @JoinColumn
    private User createdBy;

    @OneToMany(mappedBy = "person")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<PersonAudit> audits;


    @Override
    public boolean equals(@Nullable Object o) {
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;
        Person that = (Person) o;
        return eyeColor == that.eyeColor &&
                hairColor == that.hairColor &&
                Objects.equals(location, that.location) &&
                birthday.isEqual(that.birthday) &&
                weight.equals(that.weight) &&
                nationality == that.nationality;
    }

    @Override
    public int hashCode() {
        return Objects.hash(eyeColor, hairColor, location, birthday, weight, nationality);
    }
}
