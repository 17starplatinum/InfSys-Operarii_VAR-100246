package ru.ifmo.se.repository.info;

import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ru.ifmo.se.entity.info.ImportHistory;

import java.util.List;

@Repository
public interface ImportHistoryRepository extends CrudRepository<ImportHistory, Long> {
    List<ImportHistory> findByUserId(Long userId);

    @NonNull
    List<ImportHistory> findAll();
}
