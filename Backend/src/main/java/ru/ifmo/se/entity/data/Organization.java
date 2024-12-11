package ru.ifmo.se.entity.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import ru.ifmo.se.entity.data.audit.OrganizationAudit;
import ru.ifmo.se.entity.data.enumerated.OrganizationType;
import ru.ifmo.se.entity.user.User;

import java.util.List;

@Entity
@Table(name = "organization", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "legal_id", referencedColumnName = "id", nullable = false)
    private Address officialAddress;

    @NotNull
    @Positive
    @Column(name = "annual_turnover", nullable = false)
    private Float annualTurnover;

    @Positive
    @Column(name = "employees_count")
    private int employeesCount;

    @Size(min = 1, max = 1576, message = "The full name of an organization must have from 1 to 1576 characters")
    @Column(name = "full_name")
    private String fullName;

    @Enumerated(EnumType.STRING)
    private OrganizationType organizationType;

    @NotNull
    @OneToOne(cascade = {CascadeType.DETACH, CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "postal_id", nullable = false)
    private Address postalAddress;

    @OneToMany(mappedBy = "organization")
    private List<Worker> workers;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "organization")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<OrganizationAudit> audits;
}
