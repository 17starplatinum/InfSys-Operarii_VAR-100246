package ru.ifmo.se.entity;

import ru.ifmo.se.entity.operation.AddressOperation;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "address", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    private String zipCode;

    @OneToOne
    @JoinColumn(name = "location_id")
    private Location town;

    @OneToOne(mappedBy = "officialAddress")
    private Organization organization;

    @OneToOne(mappedBy = "postalAddress")
    private Organization postalOrganization;

    @OneToMany(mappedBy = "address", cascade = CascadeType.REMOVE)
    private List<AddressOperation> operations;
}
