package ru.ifmo.se.dto.criteria;

import ru.ifmo.se.entity.enumerated.Position;
import ru.ifmo.se.entity.enumerated.Status;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerFilterCriteria {
    private String name;
    private Position position;
    private Status status;
}
