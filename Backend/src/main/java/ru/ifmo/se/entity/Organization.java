package ru.ifmo.se.entity;

import ru.ifmo.se.entity.enumerated.OrganizationType;
import ru.ifmo.se.entity.operation.OrganizationOperation;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "coordinates", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @OneToOne
    @JoinColumn(name = "legal_id")
    private Address officialAddress;

    @NotNull
    @Min(1)
    private Float annualTurnover;

    @Min(1)
    private int employeesCount;

    @Size(min = 1, max = 1576)
    private String fullName;

    @Enumerated(EnumType.STRING)
    private OrganizationType type;

    @NotNull
    @OneToOne
    @JoinColumn(name = "postal_id")
    private Address postalAddress;

    @OneToOne(mappedBy = "organization")
    private Worker worker;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.REMOVE)
    private List<OrganizationOperation> operations;
}
