package ru.ifmo.se.entity.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import ru.ifmo.se.entity.data.audit.AddressAudit;
import ru.ifmo.se.entity.user.User;

import java.util.List;

@Entity
@Table(name = "address", schema = "s372799")
@Getter
@Setter
@NoArgsConstructor
public class Address implements Creatable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @Column(name = "zip_code", nullable = false)
    private String zipCode;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "town_id")
    private Location town;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "address")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<AddressAudit> audits;
}
