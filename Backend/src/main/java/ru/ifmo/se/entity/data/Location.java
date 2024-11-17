package ru.ifmo.se.entity.data;

import ru.ifmo.se.entity.user.User;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "location", schema = "s372799")
@Getter
@Setter
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private long id;

    @NotNull(message = "This abscissa CANNOT be null")
    @Column(name = "x", nullable = false)
    private Float x;

    @Column(name = "y")
    private long y;

    @NotNull(message = "This applicate CANNOT be null")
    @Column(name = "z", nullable = false)
    private Long z;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "owner_id")
    @JsonBackReference
    private User owner;
}
