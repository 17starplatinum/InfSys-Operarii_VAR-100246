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

@Entity
@Table(name = "location", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Location implements Creatable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @Column(name = "x", nullable = false)
    private Float x;

    @Column(name = "y")
    private long y;

    @NotNull
    @Column(name = "z", nullable = false)
    private Long z;

    @OneToMany(mappedBy = "location")
    private List<Person> people;

    @OneToMany(mappedBy = "town")
    private List<Address> addresses;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "location")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<LocationAudit> audits;
}
