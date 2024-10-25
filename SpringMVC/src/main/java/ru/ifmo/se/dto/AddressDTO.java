package ru.ifmo.se.dto;

import ru.ifmo.se.entity.Location;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class AddressDTO {
    private Long id;

    @NotNull
    private String zipCode;

    private Location town;
}
