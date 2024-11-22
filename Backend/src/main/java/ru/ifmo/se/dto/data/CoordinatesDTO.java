package ru.ifmo.se.dto.data;

import jakarta.validation.constraints.Max;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.user.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatesDTO {
    private Long id;

    @Max(920)
    private Double x;

    @Max(27)
    private Integer y;

    private User createdBy;
}
