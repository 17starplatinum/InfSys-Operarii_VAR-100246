package ru.ifmo.se.repository.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.Organization;
import ru.ifmo.se.entity.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends CrudRepository<Organization, Long>, PagingAndSortingRepository<Organization, Long> {

    @Override
    Optional<Organization> findById(Long aLong);

    void update(Organization organization);

    @Override
    void delete(Organization organization);

    Organization findOrganizationByFullName(String name);

    Page<Organization> findByFullNameContaining(String name, Pageable pageable);

    List<Organization> findOrganizationByOwner(User user);
}
