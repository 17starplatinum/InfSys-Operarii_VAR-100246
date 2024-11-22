package ru.ifmo.se.dto.data.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.data.enumerated.Position;
import ru.ifmo.se.entity.data.enumerated.Status;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerFilterCriteria {
    private String name;
    private String organizationName;
    private Position position;
    private Status status;
}
