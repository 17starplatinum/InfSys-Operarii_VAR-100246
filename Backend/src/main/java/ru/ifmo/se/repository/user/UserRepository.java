package ru.ifmo.se.repository.user;

import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.data.enumerated.AdminRequestStatus;
import ru.ifmo.se.entity.data.enumerated.UserRole;
import ru.ifmo.se.entity.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    @NonNull
    Optional<User> findById(@NonNull Long id);

    Optional<User> findByUsername(String username);

    void deleteById(@NonNull Long id);

    boolean existsByRole(UserRole role);

    List<User> findAllByAdminRequestStatus(AdminRequestStatus adminRequestStatus);
}
