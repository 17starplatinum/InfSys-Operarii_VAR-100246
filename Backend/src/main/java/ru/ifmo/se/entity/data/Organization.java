package ru.ifmo.se.entity.data;

import com.fasterxml.jackson.annotation.JsonBackReference;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.entity.data.enumerated.OrganizationType;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "coordinates", schema = "s372799")
@Getter
@Setter
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private long id;

    @NotNull(message = "Official address CANNOT be null")
    @OneToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "legal_id", referencedColumnName = "id", nullable = false)
    private Address officialAddress;

    @NotNull(message = "Annual turnover CANNOT be null")
    @Min(value = 1, message = "Annual turnover must be a natural value")
    @Column(name = "annual_turnover", nullable = false)
    private Float annualTurnover;


    @Min(value = 1, message = "A company must have at least 1 employee")
    @Column(name = "employees_count")
    private int employeesCount;

    @Size(min = 1, max = 1576, message = "The full name of an organization must have from 1 to 1576 characters")
    @Column(name = "full_name")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private OrganizationType type;

    @NotNull(message = "Postal address CANNOT be null")
    @OneToOne(cascade = {CascadeType.DETACH, CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "postal_id", nullable = false)
    private Address postalAddress;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "owner_id")
    @JsonBackReference
    private User owner;

    public void setEmployeesCountwNull(Integer employeesCount) {
        this.employeesCount = employeesCount;
    }
}
