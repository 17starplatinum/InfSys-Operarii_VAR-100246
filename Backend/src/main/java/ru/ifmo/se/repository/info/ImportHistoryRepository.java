package ru.ifmo.se.repository.info;

import lombok.NonNull;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.info.ImportHistory;
import ru.ifmo.se.entity.info.ImportStatus;
import ru.ifmo.se.entity.user.User;

import java.util.List;

@Repository
public interface ImportHistoryRepository extends CrudRepository<ImportHistory, Long> {
    List<ImportHistory> findByStatus(ImportStatus status);

    @Query("SELECT h FROM ImportHistory h WHERE h.user.id = :id")
    List<ImportHistory> findByUserId(Long id);
}
