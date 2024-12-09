package ru.ifmo.se.service.info;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.ifmo.se.entity.info.ImportHistory;
import ru.ifmo.se.entity.user.User;
import ru.ifmo.se.repository.info.ImportHistoryRepository;
import java.util.List;

@Service
public class ImportHistoryService {

    private final ImportHistoryRepository importHistoryRepository;

    @Autowired
    public ImportHistoryService(ImportHistoryRepository importHistoryRepository) {
        this.importHistoryRepository = importHistoryRepository;
    }

    public List<ImportHistory> getImportHistory(User currentUser) {
        if (currentUser.getAuthorities().stream().anyMatch(authority -> authority.getAuthority().equals("ADMIN"))) {
            return importHistoryRepository.findAll();
        }
        return importHistoryRepository.findByUserId(currentUser.getId());

    }
}
