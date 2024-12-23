package ru.ifmo.se.dto.info;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import ru.ifmo.se.entity.info.ImportStatus;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportHistoryDTO {
    private Long id;
    private ImportStatus status;
    private String username;
    private Integer addedObjectsCount;
    private LocalDateTime timestamp;
    private String downloadUrl;
}
