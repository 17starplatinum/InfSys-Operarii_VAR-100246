package ru.ifmo.se.dto.data;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Max;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.ifmo.se.entity.user.User;

import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatesDTO {
    private Long id;

    @Max(990)
    private double x;

    @Max(27)
    private int y;

    private User createdBy;

    @Override
    public boolean equals(@Nullable Object o) {
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;
        CoordinatesDTO that = (CoordinatesDTO) o;
        return x == that.x && y == that.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }
}
