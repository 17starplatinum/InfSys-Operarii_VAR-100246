package ru.ifmo.se.dto.criteria;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressFilterCriteria {
    private String zipCode;
}
