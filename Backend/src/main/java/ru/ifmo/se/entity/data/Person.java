package ru.ifmo.se.entity.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import ru.ifmo.se.entity.data.audit.PersonAudit;
import ru.ifmo.se.entity.data.enumerated.Color;
import ru.ifmo.se.entity.data.enumerated.Country;
import ru.ifmo.se.entity.user.User;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "person", schema = "s372799")
@Getter
@NoArgsConstructor
@Setter
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull(message = "Eye color CANNOT be null")
    @Enumerated(EnumType.STRING)
    @Column(name = "eye_color")
    private Color eyeColor;

    @Enumerated(EnumType.STRING)
    @Column(name = "hair_color")
    private Color hairColor;

    @NotNull(message = "Location CANNOT be null")
    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "location_id")
    private Location location;

    private LocalDate birthday;

    @NotNull(message = "Weight CANNOT be null")
    @Min(value = 1, message = "Weight must be a natural value")
    private Double weight;

    @NotNull(message = "Nationality CANNOT be null")
    @Enumerated(EnumType.STRING)
    private Country nationality;

    @OneToOne(mappedBy = "person")
    private Worker worker;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "person")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<PersonAudit> audits;
}
