package ru.ifmo.se.dto.data.wrappers;

import lombok.AllArgsConstructor;
import ru.ifmo.se.entity.data.Address;

import jakarta.validation.Valid;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddressWrapper {
    private Long addressId;
    @Valid
    private Address address;
}
