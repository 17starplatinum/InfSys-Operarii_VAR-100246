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
public class Organization implements Creatable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "legal_id", nullable = false)
    private Address officialAddress;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Float annualTurnover;

    @Positive
    private int employeesCount;

    @Size(min = 1, max = 1576)
    private String fullName;

    @Enumerated(EnumType.STRING)
    private OrganizationType organizationType;

    @NotNull
    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "postal_id", nullable = false)
    private Address postalAddress;

    @OneToMany(mappedBy = "organization")
    private List<Worker> workers;

    @ManyToOne
    @JoinColumn
    private User createdBy;

    @OneToMany(mappedBy = "organization")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<OrganizationAudit> audits;
}
