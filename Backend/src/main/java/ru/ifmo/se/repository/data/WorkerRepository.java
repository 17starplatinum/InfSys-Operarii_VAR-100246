package ru.ifmo.se.repository.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.Worker;

import java.util.Optional;

@Repository
public interface WorkerRepository extends CrudRepository<Worker, Long>, PagingAndSortingRepository<Worker, Long> {

    Optional<Worker> findById(long id);

    @Query("SELECT w FROM Worker w LEFT JOIN w.organization o WHERE (:name IS NULL OR w.name LIKE %:name%) AND (:fullName IS NULL OR o.fullName LIKE %:fullName%)")
    Page<Worker> findByFilters(@Param("name") String name, @Param("fullName") String fullName, Pageable pageable);

    Optional<Worker> findWorkerByPersonId(Long personId);

    @Query("SELECT COUNT(*) FROM Worker w JOIN Person p ON w.person.id = p.id WHERE p.id = :person_id")
    Long countWorkersByPerson(@Param("person_id") Long personId);

    @Query("SELECT COUNT(*) FROM Worker w WHERE w.rating < :rating")
    Long countWorkersWithLessRating(@Param("rating") Integer rating);

    @Modifying
    @Query("UPDATE Worker AS w SET w.status = 'FIRED', w.salary = 0, w.organization = null WHERE w.id = :worker_id")
    void fireWorkerFromOrganization(@Param("worker_id") Long workerId);

    @Modifying
    @Query("UPDATE Worker AS w SET w.organization.employeesCount = w.organization.employeesCount - 1, w.organization.id = :org_id, w.organization.employeesCount = w.organization.employeesCount + 1 WHERE w.id = :worker_id")
    void transferWorkerToAnotherOrganization(@Param("org_id") Long organizationId, @Param("worker_id") Long workerId);
}
