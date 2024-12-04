package ru.ifmo.se.repository.data;

import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.Organization;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends CrudRepository<Organization, Long>, PagingAndSortingRepository<Organization, Long> {

    @Override
    @NonNull
    Optional<Organization> findById(@NonNull Long aLong);

    @Override
    void delete(@NonNull Organization organization);

    Page<Organization> findByFullNameContaining(String name, Pageable pageable);

    @Modifying
    @Query("UPDATE Organization o SET o.employeesCount = o.employeesCount + :value WHERE o.id = :org_id")
    void updateEmployeesCount(@Param("org_id") Long orgId, @Param("value") int value);
}
