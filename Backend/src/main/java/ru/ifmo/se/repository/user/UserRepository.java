package ru.ifmo.se.repository.user;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.enumerated.AdminRequestStatus;
import ru.ifmo.se.entity.data.enumerated.UserRole;
import ru.ifmo.se.entity.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    Optional<User> findById(Long id);

    Optional<User> findByUsername(String username);

    void deleteById(Long id);

    @SuppressWarnings("unchecked")
    @Query("from User where role = 'ADMIN'")
    List<User> findAllAdmin();

    boolean existsByRole(UserRole role);

    List<User> findAllByAdminRequestStatus(AdminRequestStatus adminRequestStatus);
}
