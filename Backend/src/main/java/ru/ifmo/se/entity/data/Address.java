package ru.ifmo.se.entity.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;
import ru.ifmo.se.entity.user.User;

@Entity
@Table(name = "address", schema = "s372799")
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private long id;

    @NotNull(message = "Zip code cannot be null")
    @Column(name = "zip_code", nullable = false)
    private String zipCode;

    @OneToOne
    @JoinColumn(name = "location_id")
    private Location town;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "owner_id")
    @JsonBackReference
    private User owner;
}
