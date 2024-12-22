package ru.ifmo.se.repository.data;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.Worker;
import ru.ifmo.se.entity.data.enumerated.Color;
import ru.ifmo.se.entity.data.enumerated.Country;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends CrudRepository<Worker, Long>, PagingAndSortingRepository<Worker, Long> {

    Optional<Worker> findById(long id);

    @Query("SELECT w FROM Worker w LEFT JOIN w.organization o WHERE (:name IS NULL OR w.name LIKE %:name%) AND (:fullName IS NULL OR o.fullName LIKE %:fullName%)")
    Page<Worker> findByFilters(@Param("name") String name, @Param("fullName") String fullName, Pageable pageable);

    Optional<Worker> findWorkerByPersonId(Long personId);

    @Query("SELECT COUNT(*) FROM Worker w JOIN Person p ON w.person.id = p.id WHERE p.id = :personId")
    Long countWorkersByPerson(@Param("personId") Long personId);

    @Query("SELECT COUNT(*) FROM Worker w WHERE w.rating < :rating")
    Long countWorkersWithLessRating(@Param("rating") Integer rating);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT w FROM Worker w WHERE w.name = :name AND w.coordinates.x = :x AND w.coordinates.y = :y")
    List<Worker> findByNameAndCoordinatesForUpdate(@Param("name") String name, @Param("x") double x, @Param("y") int y);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT w FROM Worker w WHERE w.name = :name AND w.person.eyeColor = :eyeColor AND w.person.hairColor = :hairColor" +
            " AND w.person.location.x = :x AND w.person.location.y = :y AND w.person.location.z = :z AND"
            +" w.person.birthday = :birthday AND w.person.weight = :weight AND w.person.nationality = :nationality")
    List<Worker> findByNameAndPersonForUpdate(
            @Param("name") String name,
            @Param("eyeColor") Color eyeColor,
            @Param("hairColor") Color hairColor,
            @Param("x") Float x,
            @Param("y") long y,
            @Param("z") Long z,
            @Param("birthday") LocalDate birthday,
            @Param("weight") Double weight,
            @Param("nationality") Country nationality
    );

    @Modifying
    @Query("UPDATE Worker AS w SET w.status = 'FIRED', w.salary = null, w.organization = null WHERE w.id = :worker_id")
    void fireWorkerFromOrganization(@Param("worker_id") Long workerId);

    @Modifying
    @Query("UPDATE Worker AS w SET w.organization.id = :org_id WHERE w.id = :worker_id")
    void transferWorkerToAnotherOrganization(@Param("org_id") Long organizationId, @Param("worker_id") Long workerId);

    @Query("SELECT w FROM Worker w WHERE w.name = :name AND w.coordinates.id = :coordinates_id")
    Optional<Worker> findByNameAndCoordinates(@Param("name") String name, @Param("coordinates_id") Long coordinatesId);

    @Query("SELECT w FROM Worker w WHERE w.name = :name AND w.person.id = :person_id")
    Optional<Worker> findByNameAndPerson(@Param("name") String name, @Param("person_id") Long personId);
}
