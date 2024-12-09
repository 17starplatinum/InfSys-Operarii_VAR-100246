package ru.ifmo.se.dto.info;

import lombok.Getter;
import lombok.Setter;
import ru.ifmo.se.entity.info.ImportHistory;

@Getter
@Setter
public class ImportHistoryDTO {
    private Long id;
    private String status;
    private String username;
    private Integer addedObjectsCount;
    private Integer totalObjectsCount;
}
