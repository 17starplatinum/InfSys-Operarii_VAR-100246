package ru.ifmo.se.dto.data.response;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddressDTOResponse {
    @NotNull
    private String zipCode;

    private LocationDTOResponse town;
}
