package ru.ifmo.se.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @JoinColumn(name = "legal_id", referencedColumnName = "id")
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
    @JoinColumn(name = "postal_id", referencedColumnName = "id")
    private Address postalAddress;

    @OneToOne
    @JoinColumn(name = "update_id", referencedColumnName = "id")
    private UpdateTracker update;
}
